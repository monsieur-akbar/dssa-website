import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";

const linkClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-400 transition-colors hover:border-slate-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400";

export default function SocialLinks({ name, linkedin, github, className = "" }) {
  if (!linkedin && !github) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} on LinkedIn`}
          className={linkClass}
        >
          <LinkedinIcon />
        </a>
      )}
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} on GitHub`}
          className={linkClass}
        >
          <GithubIcon />
        </a>
      )}
    </div>
  );
}
