import Link from "next/link";
import { FaGithub, FaEnvelope } from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";

export default function Footer() {
  return (
    <div className="flex justify-end items-center h-16 border-t max-w-screen-2xl w-full mx-auto px-10 mb-10">
      <div className="text-sm text-muted-foreground mt-10">
        <div className="w-full flex items-center justify-end gap-4">
          <Link href="https://github.com/lazy-dinosaur" target="_blank">
            <FaGithub size={18} />
          </Link>
          <Link href="mailto:woohs0130@naver.com" target="_blank">
            <FaEnvelope size={18} />
          </Link>
          <Link href="https://open.kakao.com/o/sdG4BPjh" target="_blank">
            <RiKakaoTalkFill size={18} />
            {/* 카카오톡 전용 ��이콘 없을 경우 채팅 아이콘으로 대체 */}
          </Link>
        </div>
        <div className="mt-3">Copyright © 2025 by Hyeongseok Woo</div>
      </div>
    </div>
  );
}
