import Image from "next/image";
import Link from "next/link";

export default function home() {
  return (
    <div className="grid max-h-215 grid-cols-9 grid-rows-6 gap-6">
      <Link
        href="/"
        className="group relative col-span-6 row-span-6 rounded-lg bg-[#1a1a35] overflow-hidden flex justify-center"
      >
        <Image
          src="/software-ecommerce-1.svg"
          className="group-hover:scale-105 transition-transform duration-500"
          width={860}
          height={860}
          quality={100}
          alt=""
        />

        <div className="absolute bottom-28 right-28 h-12 flex items-center gap-2 max-w-70 rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
          <span className="text-sm truncate">Analytics Dashboard</span>
          <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">R$1.800</span>
        </div>
      </Link>

      <Link
        href="/"
        className="group relative col-span-3 row-span-3 rounded-lg bg-[#1a1a35] overflow-hidden flex justify-center"
      >
        <Image
          src="/software-ecommerce-2.svg"
          className="group-hover:scale-105 transition-transform duration-500"
          width={860}
          height={860}
          quality={100}
          alt=""
        />

        <div className="absolute bottom-10 right-10 h-12 flex items-center gap-2 max-w-70 rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
          <span className="text-sm truncate">Project Manager Pro</span>
          <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">R$800</span>
        </div>
      </Link>

      <Link
        href="/"
        className="group relative col-span-3 row-span-3 rounded-lg bg-[#1a1a35] overflow-hidden flex justify-center"
      >
        <Image
          src="/software-ecommerce-3.svg"
          className="group-hover:scale-105 transition-transform duration-500"
          width={860}
          height={860}
          quality={100}
          alt=""
        />

        <div className="absolute bottom-10 right-10 h-12 flex items-center gap-2 max-w-70 rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
          <span className="text-sm truncate">Team Messenger</span>
          <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">R$1.200</span>
        </div>
      </Link>
    </div>
  );
}
