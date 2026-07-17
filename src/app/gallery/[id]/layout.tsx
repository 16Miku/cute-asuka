const ids = ["1", "2", "3", "4", "5", "6"];

export function generateStaticParams() {
  return ids.map((id) => ({ id }));
}

export default function GalleryIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
