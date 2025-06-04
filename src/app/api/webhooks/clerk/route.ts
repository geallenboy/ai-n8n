import { WebhookEvent } from "@clerk/nextjs/server"
import { headers } from "next/headers"
import { Webhook } from "svix"
import { upsertUser, getUserByEmail } from "@/features/users/actions/user-actions"

export async function POST(req: Request) {
    console.log("🔄 Clerk webhook received")
    
    const headerPayload = await headers()
    const svixId = headerPayload.get("svix-id")
    const svixTimestamp = headerPayload.get("svix-timestamp")
    const svixSignature = headerPayload.get("svix-signature")

    if (!svixId || !svixTimestamp || !svixSignature) {
        console.error("❌ Missing svix headers")
        return new Response("Error occurred -- no svix headers", {
            status: 400,
        })
    }

    // 检查 webhook secret 是否配置
    if (!process.env.CLERK_WEBHOOK_SECRET) {
        console.error("❌ CLERK_WEBHOOK_SECRET environment variable is not set")
        return new Response("Webhook secret not configured", {
            status: 500,
        })
    }

    const payload = await req.json()
    const body = JSON.stringify(payload)

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET as string)
    let event: WebhookEvent

    try {
        event = wh.verify(body, {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature,
        }) as WebhookEvent
    } catch (err) {
        console.error("❌ Error verifying webhook:", err)
        return new Response("Error occurred", {
            status: 400,
        })
    }

    console.log(`📝 Processing event: ${event.type}`)

    if (event.type === "user.created" || event.type === "user.updated") {
        const email = event.data.email_addresses.find(
            email => email.id === event.data.primary_email_address_id
        )?.email_address
        const name = `${event.data.first_name || ''} ${event.data.last_name || ''}`.trim()
        
        console.log(`👤 ${event.type === "user.created" ? "Creating" : "Updating"} user: ${email}`)
        
        if (!email) {
            console.error(`❌ No email found in ${event.type} event`)
            return new Response("No email", { status: 400 })
        }

        // 使用 upsertUser 函数处理用户创建或更新
        try {
            const result = await upsertUser({
                email,
                fullName: name || email.split('@')[0], // 如果没有名字，使用邮箱前缀
                provider: 'clerk',
                providerId: event.data.id,
            });
            
            if (result.success && result.data) {
                console.log(`✅ User ${result.isNew ? 'created' : 'updated'} successfully:`, {
                    id: result.data.id,
                    email: result.data.email,
                    fullName: result.data.fullName,
                    isNew: result.isNew
                });
            } else {
                console.error('❌ Error upserting user:', result.error);
                return new Response("Error processing user", { status: 500 });
            }
        } catch (error) {
            console.error('❌ Error upserting user:', error);
            return new Response("Error processing user", { status: 500 });
        }
    } else if (event.type === "user.deleted") {
        console.log(`🗑️ Deleting user: ${event.data.id}`)
        
        // 对于删除操作，我们需要先找到用户然后删除
        // 由于我们没有直接的 deleteUserByProviderId 函数，我们可以记录这个事件
        // 或者实现一个新的函数来处理这种情况
        console.log('ℹ️ User deletion event received but not processed - consider implementing if needed');
    } else {
        console.log(`ℹ️ Unhandled event type: ${event.type}`)
    }

    return new Response("", { status: 200 })
}
