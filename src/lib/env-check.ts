// 环境变量检查工具
export function checkStripeEnvVars() {
  const requiredServerVars = [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET'
  ];
  
  const requiredClientVars = [
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_SITE_URL'
  ];

  console.log('=== Stripe Environment Variables Check ===');
  
  // 检查服务端变量（只在服务端运行）
  if (typeof window === 'undefined') {
    console.log('Server-side variables:');
    requiredServerVars.forEach(varName => {
      const value = process.env[varName];
      console.log(`${varName}: ${value ? '✅ Set' : '❌ Missing'}`);
      if (value) {
        console.log(`  Length: ${value.length}`);
        console.log(`  Starts with: ${value.substring(0, 10)}...`);
      }
    });
  }

  // 检查客户端变量
  console.log('Client-side variables:');
  requiredClientVars.forEach(varName => {
    const value = process.env[varName];
    console.log(`${varName}: ${value ? '✅ Set' : '❌ Missing'}`);
    if (value) {
      console.log(`  Value: ${value}`);
    }
  });

  console.log('==========================================');
} 