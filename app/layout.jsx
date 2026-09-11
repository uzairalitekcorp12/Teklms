import "./globals.css";
import Providers from "./providers";
export const metadata = {
  title: {
    default: "TekLMS — Learning Management System",
    template: "%s · TekLMS",
  },
  description:
    "Academic operations, protected lectures, student learning, communication and reporting in one connected workspace.",
  applicationName: "TekLMS",
};
const themeScript = `(()=>{try{const s=localStorage.getItem('teklms-theme');const t=s==='dark'||s==='light'?s:'dark';document.documentElement.dataset.theme=t}catch{document.documentElement.dataset.theme='dark'}})();`;
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
