// File: dialog.ts
type DialogType = 'confirm' | 'alert';
type Position = 'top' | 'top-center' | 'bottom-center';

interface DialogConfig {
    title?: string;
    message: string;
    type: DialogType;
    confirmText?: string;
    cancelText?: string;
    overlayColor?: string;
}

const defaultDialogConfig: DialogConfig = {
    type: 'confirm',
    message: '',
    confirmText: 'Xác nhận',
    cancelText: 'Hủy bỏ',
    overlayColor: 'rgba(32, 31, 31, 0.5)'
};

export async function showDialog(userConfig: DialogConfig): Promise<boolean> {
    const config: DialogConfig = { ...defaultDialogConfig, ...userConfig };

    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: ${config.overlayColor};
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;

        const dialog = document.createElement('div');
        dialog.style.cssText = `
      background: white;
      padding: 24px;
      border-radius: 8px;
      min-width: 500px;
      border-radius: 10px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      font-family: Arial, sans-serif;
    `;

        dialog.innerHTML = `
      <h3 style="
        margin: 0 0 16px 0;
        color:rgb(0, 60, 241);
        font-size: 18px;
        font-weight: bold; 
      ">${config.title || 'Xác nhận'}</h3>
      
      <p style="
        margin: 0 0 24px 0;
        color: black;
        font-size: 16px;
        line-height: 1.5;
      ">${config.message}</p>
      
      <div style="
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      ">
        ${config.type === 'confirm' ? `
          <button class="dialog-cancel" style="
            padding: 8px 16px;
            background:rgb(255, 0, 0);
            border: 1px solid #ddd;
            border-radius: 10px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold; 
           color: white;
          ">${config.cancelText}</button>
        ` : ''}
        
        <button class="dialog-confirm" style="
          padding: 8px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold; 
        ">${config.confirmText}</button>
      </div>
    `;

        // Xử lý sự kiện
        const confirmBtn = dialog.querySelector('.dialog-confirm') as HTMLButtonElement;
        const cancelBtn = dialog.querySelector('.dialog-cancel') as HTMLButtonElement;

        const cleanup = () => document.body.removeChild(overlay);

        confirmBtn.addEventListener('click', () => {
            cleanup();
            resolve(true);
        });

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                cleanup();
                resolve(false);
            });
        }

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
    });
}