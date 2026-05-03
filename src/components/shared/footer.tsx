export default function Footer() {
  return (
    <footer>
      <div className="container mx-auto">
        <div className="px-4 py-6 text-center">
          <small className="text-sm">
            Evently @ <span>{new Date().getFullYear()}</span>
          </small>
        </div>
      </div>
    </footer>
  );
}
