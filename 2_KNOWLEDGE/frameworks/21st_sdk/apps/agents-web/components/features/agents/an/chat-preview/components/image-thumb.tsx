export function ImageThumb({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt="attachment"
      className="size-8 object-cover rounded cursor-pointer"
    />
  )
}
