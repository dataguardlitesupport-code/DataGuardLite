import React, { useState } from 'react';
import { 
  CloudOff, 
  Settings, 
  Wifi,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldAlert,
  BatteryCharging,
  Smartphone,
  PlayCircle,
  Navigation,
  RefreshCcw,
  Globe,
  Music,
  Shield,
  Zap,
  Download,
  BellOff,
  MapPin,
  Trash2,
  MessageCircle
} from 'lucide-react';
import { openDeviceSettings } from '../services/native';
import { useLanguage } from '../services/i18n';

interface TipItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  steps: string[];
  actionId?: string;
  buttonLabel?: string;
  level?: 'Basic' | 'Pro';
}

const professionalTips: TipItem[] = [
  {
    id: 'bg-data',
    icon: <CloudOff size={24} />,
    title: "Restrict Background Data",
    description: "Many apps aggressively sync files and fetch data in the background, consuming significant data without your knowledge.",
    steps: [
      "Tap 'Open Settings' below.",
      "Navigate to Network & Internet > Mobile Network > App Data Usage.",
      "Select the app draining your data.",
      "Toggle 'Background data' off."
    ],
    actionId: 'android.settings.DATA_USAGE_SETTINGS',
    buttonLabel: "Open Data Settings",
    level: 'Pro'
  },
  {
    id: 'play-store-wifi',
    icon: <Smartphone size={24} />,
    title: "Auto-Update Apps Over Wi-Fi",
    description: "App updates can be hundreds of megabytes. Ensure they only download when connected to a Wi-Fi network.",
    steps: [
      "Open the Google Play Store app.",
      "Tap your profile icon in the top right.",
      "Go to Settings > Network Preferences > Auto-update apps.",
      "Select 'Over Wi-Fi only'."
    ],
    level: 'Basic'
  },
  {
    id: 'social-media-autoplay',
    icon: <PlayCircle size={24} />,
    title: "Disable Video Autoplay",
    description: "Social media apps automatically play videos as you scroll, which is a massive drain on cellular data.",
    steps: [
      "Open Facebook, Twitter, or Instagram.",
      "Navigate to the app's internal Settings > Media or Data Usage.",
      "Find the 'Autoplay' setting.",
      "Set it to 'Never Autoplay Videos' or 'Wi-Fi Only'."
    ],
    level: 'Basic'
  },
  {
    id: 'mobile-always-active',
    icon: <Settings size={24} />,
    title: "Disable Mobile Data Always Active",
    description: "By default, some devices keep mobile data active even when connected to Wi-Fi to ensure fast network switching, causing background data leaks.",
    steps: [
      "Tap 'Open Developer Options' below.",
      "Scroll down to the 'Networking' section.",
      "Locate 'Mobile data always active'.",
      "Toggle the switch to the OFF position."
    ],
    actionId: 'android.settings.APPLICATION_DEVELOPMENT_SETTINGS',
    buttonLabel: "Open Developer Options",
    level: 'Pro'
  },
  {
    id: 'account-sync',
    icon: <RefreshCcw size={24} />,
    title: "Turn Off Account Sync",
    description: "Google and other accounts constantly sync contacts, emails, and drive files. Turn off global sync or disable specific services.",
    steps: [
      "Tap 'Open Sync Settings' below.",
      "View your connected accounts.",
      "Disable 'Automatically sync app data' or tap into accounts to turn off specific sync features."
    ],
    actionId: 'android.settings.SYNC_SETTINGS',
    buttonLabel: "Open Sync Settings",
    level: 'Pro'
  },
  {
    id: 'offline-maps',
    icon: <Navigation size={24} />,
    title: "Use Offline Maps",
    description: "Live GPS navigation constantly downloads map tiles and traffic data. Download areas in advance.",
    steps: [
      "Open Google Maps while on Wi-Fi.",
      "Tap your profile picture > Offline maps.",
      "Select 'Select your own map'.",
      "Pinch to zoom out to the area you travel often and tap Download."
    ],
    level: 'Basic'
  },
  {
    id: 'data-roaming',
    icon: <Globe size={24} />,
    title: "Disable Data Roaming",
    description: "Prevent your phone from connecting to other operators' networks when you leave your covered area, avoiding massive fees.",
    steps: [
      "Tap 'Open Roaming Settings' below.",
      "Ensure Data Roaming is toggled OFF."
    ],
    actionId: 'android.settings.DATA_ROAMING_SETTINGS',
    buttonLabel: "Open Roaming Settings",
    level: 'Basic'
  },
  {
    id: 'streaming-quality',
    icon: <Music size={24} />,
    title: "Lower Streaming Quality",
    description: "Audio and video streaming apps (Spotify, Netflix, YouTube) consume gigabytes if set to high quality.",
    steps: [
      "Open your preferred streaming app (e.g., Spotify).",
      "Go to Settings > Audio Quality.",
      "Set Cellular streaming quality to 'Low' or 'Normal'.",
      "Also consider disabling Canvas (short looping visuals) in Spotify."
    ],
    level: 'Basic'
  },
  {
    id: 'metered-wifi',
    icon: <Wifi size={24} />,
    title: "Configure Wi-Fi Data Constraints",
    description: "If you use a mobile hotspot, tell your secondary device to treat the Wi-Fi connection as a 'Metered' network to pause auto-updates.",
    steps: [
      "Tap 'Open Wi-Fi Settings' below.",
      "Tap the gear icon next to your current network.",
      "Tap 'Advanced' > 'Metered'.",
      "Change the setting to 'Treat as metered'."
    ],
    actionId: 'android.settings.WIFI_SETTINGS',
    buttonLabel: "Open Wi-Fi Settings",
    level: 'Pro'
  },
  {
    id: 'app-permissions',
    icon: <Shield size={24} />,
    title: "Review App Network Permissions",
    description: "Some OS skins (like MIUI or ColorOS) allow you to block specific apps from connecting to cellular data entirely.",
    steps: [
      "Tap 'Open App Settings' below.",
      "Go to 'Apps' or 'Permission Manager'.",
      "Find the 'Network/Data' permissions and revoke access for offline games or tools."
    ],
    actionId: 'android.settings.APPLICATION_SETTINGS',
    buttonLabel: "Open App Settings",
    level: 'Pro'
  },
  {
    id: 'lite-apps',
    icon: <Zap size={24} />,
    title: "Switch to 'Lite' Apps",
    description: "Major platforms offer 'Lite' versions of their apps designed specifically for low-bandwidth environments.",
    steps: [
      "Open the Google Play Store.",
      "Search for 'Facebook Lite', 'Messenger Lite', or 'Instagram Lite'.",
      "Install these versions and uninstall the full, heavy apps."
    ],
    level: 'Basic'
  },
  {
    id: 'pre-download',
    icon: <Download size={24} />,
    title: "Pre-Download Media over Wi-Fi",
    description: "Instead of streaming content on the go, download it ahead of time while you have a stable, free Wi-Fi connection.",
    steps: [
      "Before leaving home, open your podcast or music app.",
      "Manually select episodes or playlists and tap 'Download'.",
      "Set Netflix or YouTube to 'Download' content to watch on commute."
    ],
    level: 'Basic'
  },
  {
    id: 'data-saver',
    icon: <ShieldAlert size={24} />,
    title: "Enable System-Wide Data Saver",
    description: "Android's built-in Data Saver mode restricts most apps from using data in the background unless explicitly allowed.",
    steps: [
      "Tap 'Open Network Settings' below.",
      "Select 'Data Saver'.",
      "Toggle 'Use Data Saver' ON."
    ],
    actionId: 'android.settings.DATA_SAVER_SETTINGS',
    buttonLabel: "Open Data Saver",
    level: 'Pro'
  },
  {
    id: 'browser-compression',
    icon: <Globe size={24} />,
    title: "Use Browser Data Compression",
    description: "Some web browsers optimize websites on remote servers before sending them to your phone, saving up to 50% data.",
    steps: [
      "Install a browser like Opera Mini or open Google Chrome.",
      "In Chrome, go to Settings > Lite mode.",
      "Turn on Lite mode to compress pages."
    ],
    level: 'Pro'
  },
  {
    id: 'notifications',
    icon: <BellOff size={24} />,
    title: "Disable Unnecessary Notifications",
    description: "Apps frequently connect to servers just to check if there are new notifications, which keeps the cellular radio active.",
    steps: [
      "Tap 'Open App Settings' below.",
      "Select 'Apps & Notifications' > 'See all apps'.",
      "Select apps you don't need real-time alerts from and turn off notifications."
    ],
    actionId: 'android.settings.APPLICATION_SETTINGS',
    buttonLabel: "Open App Settings",
    level: 'Pro'
  },
  {
    id: 'location-gps',
    icon: <MapPin size={24} />,
    title: "Restrict Location Services",
    description: "Constant GPS pinging requires map and location data from cell towers and Wi-Fi networks.",
    steps: [
      "Tap 'Open Location Settings' below.",
      "Turn off location entirely, or restrict certain apps from accessing location."
    ],
    actionId: 'android.settings.LOCATION_SOURCE_SETTINGS',
    buttonLabel: "Open Location Settings",
    level: 'Pro'
  },
  {
    id: 'clear-cache',
    icon: <Trash2 size={24} />,
    title: "Clear App Cache",
    description: "Sometimes corrupted cache forces an app to continuously redownload the same files.",
    steps: [
      "Tap 'Open Storage Settings' below.",
      "Go to 'Storage' > 'Other Apps'.",
      "Select an app and tap 'Clear Cache'."
    ],
    actionId: 'android.settings.INTERNAL_STORAGE_SETTINGS',
    buttonLabel: "Open Storage Settings",
    level: 'Basic'
  },
  {
    id: 'whatsapp-media',
    icon: <MessageCircle size={24} />,
    title: "Stop WhatsApp Media Auto-Download",
    description: "WhatsApp groups can quickly consume gigabytes if photos and videos are automatically downloaded over cellular.",
    steps: [
      "Open WhatsApp.",
      "Tap the 3 dots > Settings > Storage and data.",
      "Under 'Media auto-download', select 'When using mobile data'.",
      "Uncheck all media types (Photos, Audio, Videos, Documents)."
    ],
    level: 'Basic'
  },
  {
    id: 'system-updates',
    icon: <Settings size={24} />,
    title: "Restrict OTA System Updates",
    description: "Ensure your phone does not download massive system software updates while on mobile data.",
    steps: [
      "Tap 'Open System Settings' below.",
      "Navigate to 'System Updates' or 'Software Updates'.",
      "Ensure 'Auto download over Wi-Fi' is the only option selected."
    ],
    actionId: 'android.settings.SETTINGS',
    buttonLabel: "Open System Settings",
    level: 'Pro'
  },
  {
    id: 'battery-saver',
    icon: <BatteryCharging size={24} />,
    title: "Use Battery Saver Mode",
    description: "Battery saver mode inherently reduces data usage by dramatically limiting background syncs and polling intervals.",
    steps: [
      "Tap 'Open Battery Settings' below.",
      "Select 'Battery Saver'.",
      "Turn it on or set a schedule based on percentage."
    ],
    actionId: 'android.settings.BATTERY_SAVER_SETTINGS',
    buttonLabel: "Open Battery Settings",
    level: 'Basic'
  }
];

export const Tips: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(professionalTips[0].id);
  const { t } = useLanguage();

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t('Optimization Strategy')}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{t('Professional techniques to eliminate background data drain.')}</p>
        </div>
      </div>

      <div className="space-y-4">
        {professionalTips.map((tip) => {
          const isExpanded = expandedId === tip.id;
          
          return (
            <div 
              key={tip.id} 
              className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${
                isExpanded 
                  ? 'border-primary-500/50 shadow-md ring-1 ring-primary-500/20' 
                  : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <button 
                onClick={() => toggleExpand(tip.id)}
                className="w-full p-6 flex items-start gap-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  isExpanded 
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                    : 'bg-primary-50 dark:bg-primary-900/30 text-primary-500'
                }`}>
                  {tip.icon}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{tip.title}</h3>
                    {tip.level && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        tip.level === 'Pro' 
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      }`}>
                        {tip.level}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed line-clamp-2">
                    {tip.description}
                  </p>
                </div>
                <div className="shrink-0 pt-2 text-slate-400">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              <div 
                className={`transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <div className="mt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">{t('Implementation Steps')}</h4>
                    <ul className="space-y-3 mb-6">
                      {tip.steps.map((step, index) => (
                        <li key={index} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-center font-mono text-xs font-bold leading-none">
                            {index + 1}
                          </span>
                          <span className="pt-0.5">{t(step)}</span>
                        </li>
                      ))}
                    </ul>
                    {tip.actionId && tip.buttonLabel && (
                      <button 
                        onClick={() => openDeviceSettings(tip.actionId!)}
                        className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 group"
                      >
                        <span>{t(tip.buttonLabel)}</span>
                        <ExternalLink size={18} className="duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
