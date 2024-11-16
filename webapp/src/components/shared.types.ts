/**
 * Represents the current processing status for the display
 */
export interface ProcessingProps {
  /** Whether the display is currently processing */
  readonly isProcessing: boolean;
  /** Sets whether the display is currently processing */
  readonly setIsProcessing: (value: boolean) => void;
}
