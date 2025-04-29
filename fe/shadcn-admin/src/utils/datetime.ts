import { format } from 'date-fns'

// Convert datetime string to server format (UTC ISO)
export const toServerDateTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return null;
  const date = new Date(dateTimeStr);
  // Convert to UTC time
  const utcDate = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    )
  );
  return utcDate.toISOString();
}

// Format datetime from server for display
export const fromServerDateTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return ''
  const date = new Date(dateTimeStr)
  return format(date, 'dd/MM/yyyy HH:mm')
}

// Format datetime for datetime-local input 
export const toInputDateTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return ''
  const date = new Date(dateTimeStr)
  return format(date, "yyyy-MM-dd'T'HH:mm")
}
