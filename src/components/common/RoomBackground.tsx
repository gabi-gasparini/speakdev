import quartoBg from '@/assets/room/room.png'

export function RoomBackground() {
  return (
    <div
      className="absolute inset-0 h-full w-full bg-cover bg-center"
      style={{
        backgroundImage: `url(${quartoBg})`,
      }}
      aria-hidden="true"
    />
  )
}