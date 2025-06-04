import { NextRequest, NextResponse } from 'next/server';
import { createOpenRouterAPI } from '@/lib/openrouter';

// 保留Edge Runtime配置，因为AI路由不使用数据库连接
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, content, workflowJson, model } = body;

    if (!type || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: type and content' },
        { status: 400 }
      );
    }

    const openRouter = createOpenRouterAPI(model);

    switch (type) {
      case 'summary': {
        const result = await openRouter.analyzeSummary(content);
        return NextResponse.json({ success: true, data: result });
      }

      case 'workflow_interpretation': {
        if (!workflowJson) {
          return NextResponse.json(
            { error: 'workflowJson is required for workflow interpretation' },
            { status: 400 }
          );
        }
        const result = await openRouter.analyzeWorkflowInterpretation(content, workflowJson);
        return NextResponse.json({ 
          success: true, 
          data: {
            workflowInterpretation: result.interpretation,
            workflowInterpretationZh: result.interpretationZh
          }
        });
      }

      case 'workflow_tutorial': {
        if (!workflowJson) {
          return NextResponse.json(
            { error: 'workflowJson is required for workflow tutorial' },
            { status: 400 }
          );
        }
        const result = await openRouter.generateWorkflowTutorial(content, workflowJson);
        return NextResponse.json({ 
          success: true, 
          data: {
            workflowTutorial: result.tutorial,
            workflowTutorialZh: result.tutorialZh
          }
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid analysis type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('AI analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 