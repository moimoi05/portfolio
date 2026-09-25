export const PORTFOLIO_ASSISTANT_MAX_MESSAGE_LENGTH = 1200;
export const PORTFOLIO_ASSISTANT_MAX_BODY_BYTES = 8192;

export type PortfolioAssistantRequest = {
  message: string;
};

export type PortfolioAssistantResponse = {
  message: string;
};
