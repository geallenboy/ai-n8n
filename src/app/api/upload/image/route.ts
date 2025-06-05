import { NextRequest, NextResponse } from 'next/server';

// Cloudflare Images API 配置 - 这些值后面需要替换为真实的配置
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'your-account-id';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || 'your-api-token';
const CLOUDFLARE_IMAGES_API_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`;

interface CloudflareImageResponse {
  result?: {
    id: string;
    filename: string;
    uploaded: string;
    requireSignedURLs: boolean;
    variants: string[];
  };
  success: boolean;
  errors: any[];
  messages: any[];
}

// 上传文件到 Cloudflare Images
async function uploadToCloudflare(formData: FormData): Promise<CloudflareImageResponse> {
  const response = await fetch(CLOUDFLARE_IMAGES_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
    },
    body: formData,
  });

  return response.json();
}

// 从URL上传到 Cloudflare Images
async function uploadFromUrl(imageUrl: string, filename?: string): Promise<CloudflareImageResponse> {
  const formData = new FormData();
  formData.append('url', imageUrl);
  if (filename) {
    formData.append('id', filename);
  }

  return uploadToCloudflare(formData);
}

// 直接上传文件到 Cloudflare Images
async function uploadFile(file: File): Promise<CloudflareImageResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  // 生成一个唯一的文件名
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = file.name.split('.').pop() || 'jpg';
  const uniqueId = `${timestamp}-${randomString}.${fileExtension}`;
  
  formData.append('id', uniqueId);

  return uploadToCloudflare(formData);
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      // 处理URL上传
      const { url, filename } = await request.json();
      
      if (!url) {
        return NextResponse.json({ 
          success: false, 
          error: 'URL is required' 
        }, { status: 400 });
      }

      // 验证URL格式
      try {
        new URL(url);
      } catch {
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid URL format' 
        }, { status: 400 });
      }

      const result = await uploadFromUrl(url, filename);
      
      if (!result.success) {
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to upload image from URL',
          details: result.errors 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        data: {
          id: result.result?.id,
          url: `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_ID}/${result.result?.id}/public`,
          variants: result.result?.variants || [],
          filename: result.result?.filename || filename || 'image'
        }
      });

    } else if (contentType.includes('multipart/form-data')) {
      // 处理文件上传
      const formData = await request.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        return NextResponse.json({ 
          success: false, 
          error: 'No file provided' 
        }, { status: 400 });
      }

      // 验证文件类型
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid file type. Only images are allowed.' 
        }, { status: 400 });
      }

      // 验证文件大小 (最大 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ 
          success: false, 
          error: 'File size too large. Maximum size is 10MB.' 
        }, { status: 400 });
      }

      const result = await uploadFile(file);
      
      if (!result.success) {
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to upload image',
          details: result.errors 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        data: {
          id: result.result?.id,
          url: `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_ID}/${result.result?.id}/public`,
          variants: result.result?.variants || [],
          filename: result.result?.filename || file.name
        }
      });

    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid content type' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// 获取图片信息的端点
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('id');

    if (!imageId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Image ID is required' 
      }, { status: 400 });
    }

    const response = await fetch(
      `${CLOUDFLARE_IMAGES_API_URL}/${imageId}`,
      {
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Image not found',
        details: result.errors 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: result.result.id,
        url: `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_ID}/${result.result.id}/public`,
        variants: result.result.variants || [],
        filename: result.result.filename,
        uploaded: result.result.uploaded
      }
    });

  } catch (error) {
    console.error('Get image error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 