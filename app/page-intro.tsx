export function PageIntro({ title, children }: { title: string; children: React.ReactNode }) {
 return <div className="page-intro"><div className="container"><h1>{title}</h1><div className="lead">{children}</div></div></div>;
}