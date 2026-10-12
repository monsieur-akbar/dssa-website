import Avatar from "@/components/Avatar";
import RoleBadge from "@/components/RoleBadge";
import SocialLinks from "@/components/SocialLinks";

export default function ProfileCard({ member, accent }) {
  const { name, role, photo, linkedin, github } = member;

  return (
    <article className="flex h-full flex-col items-center rounded-xl border border-[#262626] bg-[#0D0D0D] p-6 text-center transition-colors hover:border-[#262626]">
      <Avatar name={name} photo={photo} size={96} />
      <h3 className="mt-4 text-base font-semibold text-white">{name}</h3>
      <div className="mt-2">
        <RoleBadge accent={accent}>{role}</RoleBadge>
      </div>
      <SocialLinks
        name={name}
        linkedin={linkedin}
        github={github}
        className="mt-auto pt-5"
      />
    </article>
  );
}
