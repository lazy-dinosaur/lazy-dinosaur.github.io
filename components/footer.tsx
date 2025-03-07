import Link from "next/link";
import { FaGithub, FaEnvelope } from "react-icons/fa";
import { BsChatSquare } from "react-icons/bs"; // 카카오톡 아이콘 대체 (BsChatSquare 사용)

export default function Footer() {
  return (
    <div className="flex justify-end items-center h-16 border-t max-w-screen-2xl w-full mx-auto px-10 mb-10">
      <div className="text-sm text-muted-foreground mt-10">
        <div className="w-full flex items-center justify-end gap-4">
          <Link href="https://github.com/your-username" target="_blank">
            <FaGithub size={20} />
          </Link>
          <Link href="mailto:your-email@example.com" target="_blank">
            <FaEnvelope size={20} />
          </Link>
          <Link href="https://kakaotalk-link" target="_blank">
            <BsChatSquare size={20} />{" "}
            {/* 카카오톡 전용 ��이콘 없을 경우 채팅 아이콘으로 대체 */}
          </Link>
        </div>
        <div className="mt-3">Copyright © 2025 by Hyeongseok Woo</div>
      </div>
    </div>
  );
}
