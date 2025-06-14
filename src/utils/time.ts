// 현재 시각을 기준으로 가장 가까운 15분 단위의 시간 문자열을 반환하는 함수
export const getNearestTime = (): string => {
  const now = new Date()
  let hour = now.getHours()
  let minute = Math.round(now.getMinutes() / 15) * 15

  if (minute === 60) {
    minute = 0
    hour += 1
  }

  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
}

// HH:mm 형식의 문자열에 분 단위를 더해 새로운 HH:mm 형식의 문자열로 반환하는 함수
export const addMinutesToTime = (time: string, minutesToAdd: number): string => {
  const [hour, minute] = time.split(":").map(Number)
  const date = new Date()
  date.setHours(hour)
  date.setMinutes(minute + minutesToAdd)
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
}
