
export enum ContentType {
  MCQ = 'MCQ',
  CODE_ANALYSIS = 'CODE_ANALYSIS',
  CODING_QUESTIONS = 'CODING_QUESTIONS'
}

export enum AppEnvironment {
  PROD = 'PROD',
  BETA = 'BETA'
}

export interface MCQPayload {
  spread_sheet_name: string;
  data_sets_to_be_loaded: string[];
}

export interface CodingPayload {
  input_dir_path_url: string;
  is_json_converted: boolean;
  question_score?: number;
}
