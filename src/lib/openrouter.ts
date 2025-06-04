interface OpenRouterConfig {
  apiKey: string;
  model: string;
}

interface TranslationRequest {
  text: string;
  fromLang: 'zh' | 'en';
  toLang: 'zh' | 'en';
}

interface AnalysisRequest {
  content: string;
  type: 'summary' | 'workflow_interpretation' | 'workflow_tutorial';
  workflowJson?: any;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class OpenRouterAPI {
  private config: OpenRouterConfig;

  constructor(config: OpenRouterConfig) {
    this.config = config;
  }

  private async makeRequest(messages: Array<{ role: string; content: string }>): Promise<string> {
    try {
      const requestBody = {
        model: this.config.model,
        messages,
        temperature: 0.7,
        max_tokens: 4000
      };

      console.log('OpenRouter API Request:', {
        model: this.config.model,
        messagesCount: messages.length,
        hasApiKey: !!this.config.apiKey
      });

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'AI N8N Workflow Manager'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText
        });
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: OpenRouterResponse = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Invalid OpenRouter API Response:', data);
        throw new Error('Invalid response structure from OpenRouter API');
      }

      return data.choices[0].message.content || '';
    } catch (error) {
      console.error('OpenRouter API request failed:', error);
      throw error;
    }
  }

  async translate({ text, fromLang, toLang }: TranslationRequest): Promise<string> {
    const langMap = {
      zh: '中文',
      en: '英文'
    };

    const messages = [
      {
        role: 'system',
        content: `你是一个专业的翻译助手。请将用户提供的${langMap[fromLang]}文本准确翻译成${langMap[toLang]}。保持原文的语气、风格和专业术语的准确性。对于技术文档，请确保术语翻译的一致性和准确性。开头不要有任何开场白、问候语或介绍性文字，结束时不要添加任何总结或询问。`
      },
      {
        role: 'user',
        content: `请将以下文本从${langMap[fromLang]}翻译成${langMap[toLang]}：\n\n${text}`
      }
    ];

    return await this.makeRequest(messages);
  }

  async analyzeSummary(content: string): Promise<{ summary: string; summaryZh: string }> {
    // 生成英文摘要
    const englishSummary = await this.makeRequest([
      {
        role: 'system',
        content: `
        You are a professional Content Analyst. Your task is to create a concise and informative summary of the provided content, capturing its key points and value proposition. Focus on highlighting the functionality of any described workflow, its main advantages, and relevant use cases. The summary should be crafted to pique the interest of potential users.

Output in plain text format only; do not use Markdown.`
      },
      {
        role: 'user',
        content: `Please create a professional summary for the following content:\n\n${content}`
      }
    ]);

    // 生成中文摘要
    const chineseSummary = await this.makeRequest([
      {
        role: 'system',
        content: '你是一个专业的n8n内容分析师。请创建一个简洁、信息丰富的摘要，捕捉内容的关键点和价值主张。重点说明工作流的功能、主要优势和使用场景。让潜在用户感兴趣。'
      },
      {
        role: 'user',
        content: `请为以下内容创建专业摘要：\n\n${content}`
      }
    ]);

    return {
      summary: englishSummary,
      summaryZh: chineseSummary
    };
  }

  async analyzeWorkflowInterpretation(readme: string, workflowJson: any): Promise<{ interpretation: string; interpretationZh: string }> {
    const workflowStr = JSON.stringify(workflowJson, null, 2);

    // 生成英文工作流解读
    const englishInterpretation = await this.makeRequest([
      {
        role: 'system',
        content: `
Role Definition
You are a senior n8n workflow analysis expert with deep automation technology background and excellent communication skills. Your core mission is to parse complex n8n workflow JSON data into clear, understandable business explanations, helping non-technical users understand the value and operational mechanisms of workflows.

Output Requirements
Please strictly analyze according to the following 6 dimensions, ensuring content is accurate, concise, and practical:

1. Workflow Overview
- Function Summary: Summarize the core functionality of the workflow in one sentence
- Business Value: Explain what specific problems it solves and what benefits it brings
- Complexity Rating: Simple/Medium/Complex, with brief reasoning

2. Trigger Mechanism Analysis
- Activation Method: Detailed explanation of how the workflow is triggered (scheduled, webhook, manual, etc.)
- Trigger Conditions: List specific trigger conditions and parameter settings
- Frequency Description: Execution frequency and timing arrangements

3. Core Process Flow
- Main Steps: List 3-8 key steps in execution order
- Data Flow: Explain data transfer and transformation between nodes
- Key Nodes: Highlight the most important processing nodes and their functions

4. Use Cases and Examples
- Applicable Scenarios: List 2-3 specific use scenarios
- Real Cases: Provide practical application examples
- Extension Possibilities: Explain how it can be adjusted for other needs

5. Technical Feature Analysis
- Integrated Services: List external services and APIs involved
- Data Processing: Explain main data processing and transformation logic
- Error Handling: Analyze workflow's fault tolerance and exception handling mechanisms

6. Usage Recommendations
- Prerequisites: What needs to be prepared before use (accounts, permissions, configurations, etc.)
- Important Notes: Key configuration points and common pitfalls
- Optimization Suggestions: How to improve workflow efficiency and stability

Output Format
Please use standard Markdown format with proper structure. Avoid using complex code blocks or unusual markdown constructs.
Use simple formatting: headers (##, ###), lists (- or 1.), bold (**text**), and italic (*text*).
Do not include any greetings, introductions, or closing remarks.
`
      },
      {
        role: 'user',
        content: 
        `
Please provide a comprehensive technical interpretation of this n8n workflow:
**Workflow JSON:**
${workflowStr}

`
      }
    ]);

    // 生成中文工作流解读
    const chineseInterpretation = await this.makeRequest([
      {
        role: 'system',
        content: `
角色定位
你是一位资深的 n8n 工作流分析专家，具备深厚的自动化技术背景和优秀的表达能力。
你的核心任务是将复杂的 n8n 工作流 JSON 数据解析为清晰易懂的业务说明，
帮助非技术用户理解工作流的价值和运作机制。

输出要求
请严格按照以下6个维度进行分析，确保内容准确、简洁、实用：

1. 工作流概述
- 功能摘要：概括工作流的核心功能
- 业务价值：说明解决了什么具体问题，带来什么效益
- 复杂度评级：简单/中等/复杂，并简述原因

2. 触发机制分析
- 启动方式：详细说明工作流如何被触发（定时、webhook、手动等）
- 触发条件：列出具体的触发条件和参数设置
- 频率说明：执行频率和时间安排

3. 核心流程梳理
- 主要步骤：按执行顺序列出3-8个关键步骤
- 数据流向：说明数据在各节点间的传递和转换
- 关键节点：突出最重要的处理节点及其作用

4. 应用场景与示例
- 适用场景：列出2-3个具体的使用场景
- 实际案例：提供真实的应用示例
- 扩展可能：说明可以如何调整适应其他需求

5. 技术特点分析
- 集成服务：列出涉及的外部服务和API
- 数据处理：说明主要的数据处理和转换逻辑
- 错误处理：分析工作流的容错和异常处理机制

6. 使用建议
- 前置条件：使用前需要准备什么（账号、权限、配置等）
- 注意事项：重要的配置要点和常见陷阱
- 优化建议：如何提升工作流的效率和稳定性

输出格式
请使用标准的Markdown格式，结构清晰。避免使用复杂的代码块或异常的markdown结构。
只使用简单的格式：标题（##、###）、列表（- 或 1.）、粗体（**文字**）和斜体（*文字*）。
开头不要有任何开场白、问候语或介绍性文字，结束时不要添加任何总结或询问。
`
      },
      {
        role: 'user',
        content: `请对这个n8n工作流提供全面的技术解读：
                  **工作流JSON:**
                  ${workflowStr} 
                  `
      }
    ]);

    return {
      interpretation: englishInterpretation,
      interpretationZh: chineseInterpretation
    };
  }

  async generateWorkflowTutorial(readme: string, workflowJson: any): Promise<{ tutorial: string; tutorialZh: string }> {
    const workflowStr = JSON.stringify(workflowJson, null, 2);

    // 生成英文教程
    const englishTutorial = await this.makeRequest([
      {
        role: 'system',
        content: `
Role Definition
You are an experienced n8n trainer specializing in creating high-quality hands-on tutorials. You need to convert n8n workflows into detailed step-by-step guides that even beginners can easily follow.

Tutorial Structure Requirements
Please create tutorials according to the following complete framework, ensuring each section is actionable:

Preparation Section
1. Environment Requirements
  - n8n version requirements and installation methods
  - Required external service accounts and API keys
  - Permission and access configuration checklist

2. Preparation Work
  - Data preparation and test environment setup
  - Registration and configuration steps for related services
  - Necessary plugin or extension installation

Core Tutorial Section
3. Workflow Creation
  - Detailed steps for creating new workflows
  - Basic settings and naming conventions
  - Initial configuration key points

4. Node Configuration Details
  - Configure each node step by step in execution order
  - Specific parameter settings for each node
  - Explanation of important configuration items and recommended values
  - Common configuration errors and solutions

5. Connection and Flow Setup
  - Methods and logic for connecting nodes
  - Conditional branching and error handling configuration
  - Data mapping and field matching settings

6. Testing and Debugging
  - Step-by-step testing methods and techniques
  - Diagnosis and fixing of common issues
  - How to use debugging tools

Enhancement and Optimization Section
7. Deployment and Execution
  - Workflow activation and deployment steps
  - Monitoring and log viewing methods
  - Performance optimization recommendations

8. Maintenance and Extension
  - Daily maintenance checklist items
  - How to modify and extend workflows
  - Version management and backup strategies

Content Standards
- Actionability: Each step must have specific operational instructions
- Completeness: Cover the entire process from zero to full operation
- Accuracy: All parameters and configurations must be accurate
- User-friendliness: Use plain language suitable for beginners

Output Format
Please use standard Markdown format with proper structure. Avoid using complex code blocks or unusual markdown constructs.
Use simple formatting: headers (##, ###), lists (- or 1.), bold (**text**), and italic (*text*).
Do not include any greetings, introductions, or closing remarks.

Quality Check
After completing the tutorial, ensure:
- Step sequence is logically clear with no omissions
- Parameter settings are accurate and configurations are feasible
- Language expression is clear with explanations for technical terms
- Structure is complete and convenient for reference and learning
        `
      },
      {
        role: 'user',
        content: `
        Please create a comprehensive tutorial for implementing this n8n workflow:
**Workflow JSON:**
${workflowStr}`
      }
    ]);

    // 生成中文教程
    const chineseTutorial = await this.makeRequest([
      {
        role: 'system',
        content: 
        `
角色定位
你是一位经验丰富的 n8n 培训师，专注于创建高质量的实操教程。你的任务是将复杂
的 n8n 工作流 JSON 数据转换成清晰、简洁、面向非技术用户的教程文档。请按照以下结构组织你的输出。

1. 环境要求
  - n8n 版本要求和安装方式
  - 必需的外部服务账号和API密钥
  - 权限和访问配置清单

2. 准备工作
  - 数据准备和测试环境搭建
  - 相关服务的注册和配置步骤
  - 必要的插件或扩展安装

3. 工作流创建
  - 新建工作流的详细步骤
  - 基础设置和命名规范
  - 初始配置要点

4. 节点配置详解
  - 按执行顺序逐个配置每个节点
  - 每个节点的具体参数设置
  - 重要配置项的解释和建议值
  - 常见配置错误和解决方法

5. 连接与流程设置
  - 节点间的连接方法和逻辑
  - 条件分支和错误处理配置
  - 数据映射和字段匹配设置

6. 注意事项和最佳实践：
    - 提醒用户使用过程中需要注意的事项
    - 提供提高工作流效果的建议
    - 说明任何潜在的局限性或风险

内容标准
- 可操作性：每个步骤都要有具体的操作指令
- 完整性：涵盖从零开始到完全运行的全过程
- 准确性：所有参数和配置都要准确无误
- 友好性：用通俗易懂的语言，适合初学者理解

输出格式
请使用标准的Markdown格式，结构清晰。避免使用复杂的代码块或异常的markdown结构。
只使用简单的格式：标题（##、###）、列表（- 或 1.）、粗体（**文字**）和斜体（*文字*）。
开头不要有任何开场白、问候语或介绍性文字，结束时不要添加任何总结或询问。
        `
      },
      {
        role: 'user',
        content: `
    请为实施这个n8n工作流创建全面的教程：
    **工作流JSON:**
    ${workflowStr}
  
`
      }
    ]);

    return {
      tutorial: englishTutorial,
      tutorialZh: chineseTutorial
    };
  }
}

// 获取配置的辅助函数
export function getOpenRouterConfig(): OpenRouterConfig {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  // 使用有效的OpenRouter模型名称
  const model = process.env.OPENROUTER_DEFAULT_MODEL || 'thedrummer/valkyrie-49b-v1';

  return { apiKey, model };
}

// 导出API实例
export function createOpenRouterAPI(model?: string): OpenRouterAPI {
  const config = getOpenRouterConfig();
  if (model) {
    config.model = model;
  }
  return new OpenRouterAPI(config);
}

export default OpenRouterAPI; 