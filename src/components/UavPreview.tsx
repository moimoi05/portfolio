import type { Language } from '../context/LanguageContext';

export function UavPreview({ language }: { language: Language }) {
  const isVietnamese = language === 'vi';
  return (
    <div className="nam-uav-preview" aria-label={isVietnamese ? 'Mô phỏng minh họa thị giác nhiệt UAV' : 'Illustrative UAV thermal-vision simulation'}>
      <div className="nam-uav-stage">
        <svg
          className="nam-uav-scene"
          viewBox="0 0 1120 470"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-labelledby="nam-uav-title nam-uav-description"
        >
          <title id="nam-uav-title">{isVietnamese ? 'Mô phỏng thị giác nhiệt UAV' : 'UAV thermal-vision simulation'}</title>
          <desc id="nam-uav-description">
            {isVietnamese ? 'Hình minh họa UAV quét địa hình tổng hợp nhiều màu. Tuyến bay màu xanh lam, màu trường nhiệt, vùng quét cảm biến và hai vùng phát hiện mô phỏng được hiển thị. Không sử dụng hình ảnh hay dữ liệu vận hành.' : 'An illustrative quadcopter scans a colorful synthetic landscape. A cyan flight route, thermal ground colors, sensor sweep, and two simulated detection regions are shown. No operational imagery or data is used.'}
          </desc>
          <defs>
            <linearGradient id="nam-uav-sky" x2="0" y2="1">
              <stop stopColor="#111631" />
              <stop offset=".52" stopColor="#302054" />
              <stop offset="1" stopColor="#7b315e" />
            </linearGradient>
            <linearGradient id="nam-uav-ground" x2="0" y2="1">
              <stop stopColor="#6d2b71" />
              <stop offset=".38" stopColor="#3b285e" />
              <stop offset="1" stopColor="#182d4d" />
            </linearGradient>
            <linearGradient id="nam-uav-ridge" x1=".15" y1="0" x2=".85" y2="1">
              <stop stopColor="#f13b83" />
              <stop offset=".45" stopColor="#ff8053" />
              <stop offset=".76" stopColor="#ffc75a" />
              <stop offset="1" stopColor="#6044a5" />
            </linearGradient>
            <linearGradient id="nam-uav-scan" x1="0" y1="0" x2=".15" y2="1">
              <stop stopColor="#55f1ec" stopOpacity=".28" />
              <stop offset="1" stopColor="#55f1ec" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="nam-uav-hotspot">
              <stop stopColor="#ffe880" stopOpacity=".95" />
              <stop offset=".38" stopColor="#ff6c73" stopOpacity=".78" />
              <stop offset="1" stopColor="#ef318e" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="nam-uav-coolspot">
              <stop stopColor="#3ff5e6" stopOpacity=".75" />
              <stop offset="1" stopColor="#258dff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="nam-uav-shell" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#f4fbff" />
              <stop offset=".42" stopColor="#9bbdd1" />
              <stop offset="1" stopColor="#526b92" />
            </linearGradient>
            <pattern id="nam-uav-grid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M36 0H0V36" fill="none" stroke="#c7f7ff" strokeOpacity=".1" strokeWidth="1" />
            </pattern>
            <pattern id="nam-uav-pixels" width="9" height="9" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1" fill="#fff4ce" fillOpacity=".16" />
            </pattern>
            <filter id="nam-uav-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="nam-uav-soft-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="13" />
            </filter>
            <marker id="nam-uav-route-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0 10 5 0 10Z" fill="#72fbeb" />
            </marker>
          </defs>

          <rect width="1120" height="470" fill="url(#nam-uav-sky)" />
          <circle cx="852" cy="96" r="95" fill="#eb59bd" opacity=".16" filter="url(#nam-uav-soft-glow)" />
          <circle cx="852" cy="96" r="38" fill="#ffd590" opacity=".28" />
          <path d="M0 212 128 151l105 45 135-96 122 106 108-61 116 84 108-116 138 95 102-55 158 90v128H0Z" fill="#392957" opacity=".92" />
          <path d="m0 250 142-72 107 69 132-107 118 104 120-56 128 90 131-114 124 96 110-72 108 67v215H0Z" fill="url(#nam-uav-ground)" />
          <path d="m0 265 142-72 107 69 132-107 118 104 120-56 128 90 131-114 124 96 110-72 108 67" fill="none" stroke="#fa8ad5" strokeOpacity=".42" strokeWidth="2" />
          <path d="M0 298c152-58 215 47 366-3s201-1 314 24 192-61 440-14v165H0Z" fill="url(#nam-uav-ridge)" opacity=".82" />
          <path d="M0 337c152-57 207 47 360-1s221 4 331 29 205-54 429-7v112H0Z" fill="#352753" opacity=".65" />
          <ellipse cx="383" cy="322" rx="194" ry="73" fill="url(#nam-uav-hotspot)" />
          <ellipse cx="839" cy="344" rx="190" ry="83" fill="url(#nam-uav-coolspot)" />
          <ellipse cx="730" cy="296" rx="99" ry="38" fill="url(#nam-uav-hotspot)" opacity=".85" />
          <rect y="210" width="1120" height="260" fill="url(#nam-uav-pixels)" />
          <path d="M0 320c152-58 215 47 366-3s201-1 314 24 192-61 440-14M0 351c156-50 222 43 368 2s207 5 318 31 189-53 434-8M0 385c158-44 231 33 374 8s203 14 321 36 186-40 425-5" fill="none" stroke="#ffe3a2" strokeOpacity=".34" strokeWidth="1.4" />
          <path d="M0 0H1120V470H0Z" fill="url(#nam-uav-grid)" />
          <path d="M94 199c142-83 261-48 363-5s143 30 204-43 129-45 181 3" fill="none" stroke="#3fe9e8" strokeOpacity=".2" strokeWidth="14" filter="url(#nam-uav-soft-glow)" />
          <path d="M94 199c142-83 261-48 363-5s143 30 204-43 129-45 181 3" fill="none" stroke="#72fbeb" strokeWidth="3" strokeDasharray="8 9" markerEnd="url(#nam-uav-route-arrow)" />
          <circle cx="94" cy="199" r="6" fill="#72fbeb" filter="url(#nam-uav-glow)" />

          <path d="m562 187 74 0 181 170H417Z" fill="url(#nam-uav-scan)" />
          <path d="M600 192 478 354M600 192l228 150" stroke="#69fff2" strokeOpacity=".35" strokeWidth="1.5" strokeDasharray="4 7" />
          <path d="M466 356 600 193l220 151" fill="none" stroke="#8affef" strokeOpacity=".38" strokeWidth="1.2" />
          <path d="M603 199v131" stroke="#95fff4" strokeOpacity=".42" strokeWidth="2" strokeDasharray="5 7" />

          <g aria-hidden="true" transform="translate(602 132)">
            <ellipse cx="0" cy="33" rx="81" ry="11" fill="#4bf5eb" opacity=".21" filter="url(#nam-uav-soft-glow)" />
            <g fill="none" stroke="#8bfaf3" strokeOpacity=".88" strokeWidth="5" strokeLinecap="round">
              <path d="m-9-3-57-30M9-3l57-30M-12 4l-48 32M12 4l48 32" />
            </g>
            <g fill="#142039" stroke="#6feee6" strokeWidth="2.5">
              <ellipse cx="-70" cy="-35" rx="25" ry="6" transform="rotate(-10 -70 -35)" />
              <ellipse cx="70" cy="-35" rx="25" ry="6" transform="rotate(10 70 -35)" />
              <ellipse cx="-63" cy="37" rx="23" ry="6" transform="rotate(12 -63 37)" />
              <ellipse cx="63" cy="37" rx="23" ry="6" transform="rotate(-12 63 37)" />
            </g>
            <g fill="#f3c86a" stroke="#3d284d" strokeWidth="2">
              <circle cx="-70" cy="-35" r="4" /><circle cx="70" cy="-35" r="4" />
              <circle cx="-63" cy="37" r="4" /><circle cx="63" cy="37" r="4" />
            </g>
            <path d="M-29-9q0-10 12-12h34q12 2 12 12l-7 19H-22Z" fill="url(#nam-uav-shell)" stroke="#e3fcff" strokeWidth="1.5" />
            <path d="M-14-14q14-10 28 0" fill="none" stroke="#213658" strokeWidth="3" />
            <path d="M-9 19v13m18-13v13" stroke="#9bc8d7" strokeWidth="3" />
            <path d="M-13 34Q0 22 13 34v7q-13 11-26 0Z" fill="#172343" stroke="#78ebe8" strokeWidth="2" />
            <circle cy="38" r="5" fill="#ffca66" stroke="#fff1b5" strokeWidth="1.5" />
            <path d="M-34-2q-13 2-16 12m84-12q13 2 16 12" fill="none" stroke="#ff9b75" strokeWidth="3" strokeLinecap="round" />
          </g>

          <g fill="none" stroke="#70fff0" strokeWidth="3" filter="url(#nam-uav-glow)">
            <path d="M284 303v-19h25m66 0h25v19m0 40v19h-25m-66 0h-25v-19" />
            <path d="M738 329v-16h22m58 0h22v16m0 29v16h-22m-58 0h-22v-16" />
          </g>
          <g fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontWeight="700" fontSize="11" letterSpacing="1.4">
            <g transform="translate(284 258)"><rect width="112" height="25" rx="12" fill="#10283b" stroke="#54e7da" strokeOpacity=".65" /><circle cx="13" cy="12.5" r="3" fill="#76fff1" /><text x="23" y="16.5" fill="#c4fffa">{isVietnamese ? 'VÙNG MÔ PHỎNG A' : 'SIM REGION A'}</text></g>
            <g transform="translate(738 286)"><rect width="112" height="25" rx="12" fill="#392041" stroke="#ff91be" strokeOpacity=".7" /><circle cx="13" cy="12.5" r="3" fill="#ffcb69" /><text x="23" y="16.5" fill="#ffe5ed">{isVietnamese ? 'VÙNG MÔ PHỎNG B' : 'SIM REGION B'}</text></g>
          </g>

          <g fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="10" fontWeight="600" letterSpacing="1.3">
            <g transform="translate(937 34)"><rect width="145" height="43" rx="9" fill="#11182bdc" stroke="#ffaf7b" strokeOpacity=".55" /><path d="M15 15h13m-13 0v13m13-13v13m-13 0h13" fill="none" stroke="#ffb575" strokeWidth="1.5" /><text x="39" y="19" fill="#ffe5cb">THERMAL / IR</text><text x="39" y="32" fill="#c2a6bd" fontSize="8">{isVietnamese ? 'HÌNH MINH HỌA' : 'ILLUSTRATIVE RENDER'}</text></g>
          </g>

          <g transform="translate(41 403)" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="9" fontWeight="600" letterSpacing="1.1">
            <rect width="326" height="37" rx="18" fill="#10182acb" stroke="#9a8be0" strokeOpacity=".5" />
            <path d="M18 19h33" stroke="#72fbeb" strokeWidth="2.5" strokeDasharray="4 5" /><text x="59" y="22" fill="#ccdbf3">{isVietnamese ? 'TUYẾN BAY' : 'FLIGHT PATH'}</text>
            <circle cx="160" cy="18.5" r="4" fill="#ffb75a" /><text x="172" y="22" fill="#ccdbf3">{isVietnamese ? 'TRƯỜNG NHIỆT' : 'THERMAL FIELD'}</text>
          </g>
          <g transform="translate(1003 394)" fill="none" stroke="#c4edff" strokeOpacity=".8" strokeWidth="1.4">
            <path d="M0 0h32M0 0v32M45 0h-32M45 0v32M0 43h32M0 43V11M45 43h-32M45 43V11" />
            <path d="M22 15h2m8 0h2m-12 7h2m8 0h2" stroke="#ffdc8d" strokeWidth="3" />
          </g>
        </svg>
        <span className="nam-uav-simulation-badge"><span aria-hidden="true" /> {isVietnamese ? 'Mô phỏng minh họa' : 'Illustrative simulation'}</span>
        <span className="nam-uav-sweep-label">UAV <i aria-hidden="true" /> {isVietnamese ? 'QUÉT NHIỆT' : 'THERMAL SWEEP'}</span>
      </div>
      <div className="nam-uav-key" aria-hidden="true">
        <span><i className="nam-uav-key-route" /> {isVietnamese ? 'Tuyến bay' : 'Flight path'}</span>
        <span><i className="nam-uav-key-warm" /> {isVietnamese ? 'Trường nhiệt' : 'Thermal field'}</span>
        <span><i className="nam-uav-key-box" /> {isVietnamese ? 'Vùng phát hiện mô phỏng' : 'Simulated detections'}</span>
      </div>
    </div>
  );
}
