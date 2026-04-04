import type { AIEvaluationResult, AIEvaluationService } from '@jobSearchRun/domain'

export class AIEvaluationClient implements AIEvaluationService {
  async evaluateCv (cvText: string): Promise<AIEvaluationResult> {
    const response = await fetch('https://api-ia.example.com/evaluate', {
      method: 'POST',
      body: JSON.stringify({ text: cvText }),
      headers: { Authorization: 'Bearer' },
    })

    return response.json() as unknown as AIEvaluationResult
  }
}
