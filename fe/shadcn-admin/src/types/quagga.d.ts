declare module 'quagga' {
    interface QuaggaConfig {
      inputStream: {
        type: string;
        target: HTMLElement;
        constraints?: {
          width?: number;
          height?: number;
          facingMode?: string;
        };
      };
      decoder: {
        readers: string[];
      };
    }
  
    interface QuaggaResult {
      codeResult: {
        code: string;
      };
    }
  
    const Quagga: {
      init(config: QuaggaConfig, callback: (error: any) => void): void;
      start(): void;
      stop(): void;
      onDetected(callback: (data: QuaggaResult) => void): void;
    };
  
    export default Quagga;
  }