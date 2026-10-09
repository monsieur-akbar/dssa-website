import Avatar from "@/components/Avatar";
import RoleBadge from "@/components/RoleBadge";
import SocialLinks from "@/components/SocialLinks";

export default function FacultyCard({ faculty }) {
  const { name, designation, department, bio, photo, linkedin, github } = faculty;

  return (
    <article className="flex flex-col items-center gap-6 rounded-2xl border border-blue-500/30 bg-linear-to-br from-blue-950/40 to-slate-900/50 p-6 text-center sm:p-8 md:flex-row md:items-start md:text-left">
      <Avatar name={name} photo={photo} size={144} />
      <div className="flex-1">
        <RoleBadge accent="blue">Faculty Coordinator</RoleBadge>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {name}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          {designation}, {department}
        </p>
        <p className="mx-auto mt-4 max-w-prose text-sm leading-relaxed text-slate-300 sm:text-base md:mx-0">
          {bio}
        </p>
        <SocialLinks
          name={name}
          linkedin={linkedin}
          github={github}
          className="mt-5 justify-center md:justify-start"
        />
      </div>
    </article>
  );
}
