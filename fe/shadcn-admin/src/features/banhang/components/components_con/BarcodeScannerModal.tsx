import React, { useEffect, useRef } from 'react';
import Quagga from 'quagga';
import "../../css/BarCode.css";

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (barcode: string) => void;
}

const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> =
  ({
    isOpen,
    onClose,
    onScanSuccess
  }) => {

    const isProcessing = useRef(false);
    // useEffect(() => {
    //   if (isOpen) {
    //     const scannerElement = document.querySelector('#barcode-scanner') as HTMLElement;
    //     if (!scannerElement) {
    //       console.error('Không tìm thấy phần tử #barcode-scanner');
    //       return;
    //     }

    //     // Khởi tạo QuaggaJS
    //     Quagga.init(
    //       {
    //         inputStream: {
    //           type: 'LiveStream',
    //           target: scannerElement, // Vùng hiển thị camera
    //           constraints: {
    //             width: 400, // Chiều rộng camera
    //             height: 300, // Chiều cao camera
    //             facingMode: 'environment', // Sử dụng camera sau
    //           },
    //         },
    //         decoder: {
    //           readers: ['code_128_reader', 'ean_reader', 'ean_8_reader'], // Các loại mã vạch cần quét
    //         },
    //       },
    //       (error) => {
    //         if (error) {
    //           console.error('QuaggaJS init error:', error);
    //           return;
    //         }
    //         console.log('QuaggaJS initialized successfully');
    //         Quagga.start(); // Bắt đầu quét
    //       }
    //     );


    //     Quagga.onDetected((data) => {
    //       try {
    //         if (data && data.codeResult && data.codeResult.code) {
    //           console.log('Barcode quét được:', data.codeResult.code);
    //           onScanSuccess(data.codeResult.code); // Gọi callback khi quét thành công
    //           Quagga.stop(); // Dừng quét
    //           onClose(); // Đóng modal
    //         } else {
    //           console.warn('Không thể đọc được mã barcode');
    //         }
    //       } catch (error) {
    //         console.error('Lỗi trong Quagga.onDetected:', error);
    //       }
    //     });

    //     return () => {
    //       console.log('Dừng camera và giải phóng tài nguyên');
    //       Quagga.stop(); // Dừng camera khi modal bị đóng

    //     };
    //   }
    // }, [isOpen, onClose, onScanSuccess]);
    let isQuaggaInitialized = false; // Biến toàn cục kiểm soát trạng thái

    useEffect(() => {
      if (isOpen && !isQuaggaInitialized) {
        // const scannerElement = document.querySelector('#barcode-scanner');
        const scannerElement = document.querySelector('#barcode-scanner') as HTMLElement;
        if (!scannerElement) return;

        Quagga.init(
          {
            inputStream: {
              type: 'LiveStream',
              target: scannerElement,
              constraints: {
                width: 400,
                height: 300,
                facingMode: 'environment'
              }
            },
            decoder: { readers: ['code_128_reader', 'ean_reader', 'ean_8_reader'] },
          },
          (error) => {
            if (error) return console.error('QuaggaJS init error:', error);
            console.log('QuaggaJS initialized successfully');
            Quagga.start();
            isQuaggaInitialized = true; // Đánh dấu đã khởi tạo
          }
        );

        Quagga.onDetected((data) => {
          if (isProcessing.current) return;
          isProcessing.current = true;

          try {
            if (data?.codeResult?.code) {
              console.log('Barcode quét được:', data.codeResult.code);
              onScanSuccess(data.codeResult.code);

              Quagga.stop();
              onClose();
            }
          } catch (error) {
            console.error('Lỗi trong Quagga.onDetected:', error);
          } finally {
            setTimeout(() => {
              isProcessing.current = false;
            }, 1000);
          }
        });

        return () => {
          console.log('Dừng camera và giải phóng tài nguyên');
          Quagga.stop();
          isQuaggaInitialized = false; // Reset khi đóng modal
        };
      }
    }, [isOpen, onClose, onScanSuccess]);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">Quét mã Barcode</h2>
          <div id="barcode-scanner" style={{ width: '400px', height: '300px', border: '1px solid #ddd' }}></div>
          <button
            onClick={onClose}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  };

export default BarcodeScannerModal;