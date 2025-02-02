export interface OAIXImageHandlerResponse {
  id: string;
  success: boolean;
  imgPath: string;
  text: string;
  error?: string;
  embedding?: string;
  createdAt: string;
}
