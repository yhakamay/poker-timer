import Link from "next/link";

export default function Footer() {
  return (
    <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center absolute bottom-0 pb-8">
      <Link
        className="underline underline-offset-4 md:no-underline md:hover:underline"
        href="https://x.com/yhakamay"
        target="_blank"
        rel="noopener noreferrer"
      >
        yhakamay
      </Link>
    </footer>
  );
}
