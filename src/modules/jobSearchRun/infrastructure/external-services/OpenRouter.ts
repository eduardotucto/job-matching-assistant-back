import { OpenRouter } from '@openrouter/sdk'
import type { AIEvaluationResult, AIEvaluationService } from '@jobSearchRun/domain'
import type { Multipart } from '@fastify/multipart'

const openRouter = new OpenRouter({
  apiKey: Bun.env.OPENROUTER_API_KEY
})

const promptTemplate = `
  You are an expert resume parser and candidate profile evaluator.

  Your task is to extract the most relevant professional information from the resume text below and return ONLY a valid JSON object in a single line.

  IMPORTANT RULES:
  - Return ONLY valid JSON
  - Do NOT include markdown
  - Do NOT include explanations
  - Do NOT include comments
  - Do NOT add extra fields
  - If a field is unclear, infer the most reasonable value conservatively
  - Use only information supported by the resume whenever possible

  Return exactly this structure:

  {
    "fullName": "string",
    "role": "string",
    "experienceSummary": "string",
    "yearsOfExperience": number,
    "education": [
      {
        "degree": "string",
        "institution": "string",
        "year": "string (optional)"
      }
    ],
    "skills": ["string"],
    "languages": [
      {
        "name": "string",
        "level": "string"
      }
    ],
    "summary": "string",
    "metadata": {
      "seniorityLevel": "junior" | "mid" | "senior",
      "inferredRoleConfidence": "low" | "medium" | "high",
      "hasClearExperienceDates": boolean
    }
  }

  Field rules:

  - fullName:
    - Extract the candidate’s most complete full name
    - If not clearly available, return an empty string

  - role:
    - The candidate’s main professional role or strongest current career profile
    - Prefer the most likely professional identity over vague titles

  - experienceSummary:
    - A concise one-sentence summary of the candidate’s experience
    - Mention years and strongest relevant domains/tools/areas when possible
    - Example: "5 years in web development with React, Node.js, and Python"

  - yearsOfExperience:
    - Estimated total relevant professional experience as a number
    - Use the best evidence from work history, dates, projects, and responsibilities
    - If exact years are unclear, estimate conservatively
    - Must be a non-negative number

  - education:
    - Extract formal education entries when available
    - Each entry should include:
      - degree: degree, program, or field of study
      - institution: school, institute, university, or training provider
      - year: graduation or completion year if clearly present
    - If no education is found, return an empty array

  - skills:
    - A normalized list of relevant professional, technical, operational, analytical, or domain-specific skills
    - Remove duplicates
    - Prefer standardized English terms when possible
    - Include only skills reasonably supported by the resume

  - languages:
    - Extract spoken or written languages when explicitly mentioned
    - Each entry should include:
      - name: language name
      - level: proficiency level as written or reasonably normalized
    - Examples of normalized levels: "Native", "Basic", "Intermediate", "Advanced", "Fluent", "Professional"
    - If no languages are found, return an empty array

  - summary:
    - A concise professional summary in 2 to 4 sentences
    - Focus on profile, experience, strengths, and relevant background
    - Keep it factual and professional

  Metadata rules:

  - seniorityLevel:
    - "junior" = 0 to 2 years
    - "mid" = 3 to 5 years
    - "senior" = 6+ years
    - You may also infer from ownership, autonomy, complexity, leadership, and scope if needed

  - inferredRoleConfidence:
    - "high" if the role is clearly supported by the resume
    - "medium" if the role is somewhat inferred but still likely
    - "low" if the role is ambiguous or weakly supported

  - hasClearExperienceDates:
    - true if the resume contains sufficiently clear work dates or timeline evidence
    - false if work dates are missing, incomplete, or too ambiguous to trust strongly

  Normalization rules:
  - Normalize role and skill names to common professional terms
  - Remove duplicated skills and duplicated language entries
  - Prefer English names when reasonable
  - Ignore irrelevant personal data unless it helps identify the professional profile
  - Focus on experience, responsibilities, projects, tools, methods, achievements, and domain expertise

  Validation rules:
  - role should not be empty if enough evidence exists
  - skills should contain at least 3 items if possible
  - yearsOfExperience must be a non-negative number
  - summary must be concise and professional
  - top-level structure must match exactly

  Resume text:
  {{CV_TEXT}}
`

export class AIEvaluationClient implements AIEvaluationService {
  async evaluateCv (cvFile: Multipart): Promise<AIEvaluationResult | null> {
    if (!(cvFile && 'file' in cvFile)) throw new Error('CV file is required')

    const pdfBuffer = await cvFile.toBuffer()
    const base64Pdf = pdfBuffer.toString('base64')

    const completion = await openRouter.chat.send({
      chatRequest: {
        model: 'openrouter/free',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: promptTemplate
              },
              {
                type: 'file',
                file: {
                  filename: 'cv.pdf',
                  fileData: `data:application/pdf;base64,${base64Pdf}`
                }
              }
            ]
          }
        ],
        stream: false,
      },
    })

    const resp = completion.choices[0]?.message.content || '{}'

    return JSON.parse(resp) as AIEvaluationResult

    // return {
    //   fullName: 'Eduardo Tucto Runco',
    //   role: 'Full Stack Developer',
    //   experienceSummary: '3 years in full‑stack web development with JavaScript, TypeScript, React, Vue, Node, Nestjs, and AWS Lambda, focusing on scalable architectures, database design, and performance optimization',
    //   yearsOfExperience: 3,
    //   education: [
    //     {
    //       degree: 'Ingeniería de Sistemas',
    //       institution: 'Universidad Nacional Hermilio Valdizán',
    //       year: '2021'
    //     }
    //   ],
    //   skills: [
    //     'JavaScript', 'TypeScript', 'React', 'Vue', 'Node.js', 'NestJS', 'Next.js', 'GraphQL', 'SQL Server',
    //     'MySQL', 'PostgreSQL', 'AWS Lambda', 'EventBridge', 'Serverless', 'JWT', 'REST APIs', 'Tailwind CSS',
    //     'HTML', 'CSS', 'Git', 'Figma', 'Retool', 'FastAPI', 'Docker', 'CI/CD', 'Microservices', 'Data Modeling',
    //     'Performance Optimization', 'Problem Solving', 'Team Collaboration', 'Fast Learning'
    //   ],
    //   languages: [
    //     {
    //       name: 'Spanish',
    //       level: 'Native'
    //     },
    //     {
    //       name: 'English',
    //       level: 'Intermediate'
    //     }
    //   ],
    //   summary: 'Eduardo Tucto Runco is a Full Stack Developer with over three years of experience building robust web applications using modern JavaScript frameworks and cloud services. He has a proven track record in optimizing performance, designing serverless architectures, and improving deployment workflows. Eduardo excels in cross‑functional collaboration, rapid learning, and delivering high‑quality solutions that meet business goals.',
    //   metadata: {
    //     seniorityLevel: 'mid',
    //     inferredRoleConfidence: 'high',
    //     hasClearExperienceDates: true
    //   }
    // }
  }
}
