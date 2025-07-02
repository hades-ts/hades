import { AlertTriangle, Tag, User, X } from 'lucide-react';
import { useLogStore } from '../store/logStore';

const SPECIAL_PROPERTY_ICONS = {
    level: AlertTriangle,
    name: User,
    tags: Tag,
};

const getLevelColors = (level: string) => {
    switch (level.toLowerCase()) {
        case 'error':
            return {
                text: 'text-red-400',
                bg: 'bg-red-900/30',
                border: 'border-red-400/20',
                hoverBg: 'hover:bg-red-900/40'
            };
        case 'warn':
        case 'warning':
            return {
                text: 'text-yellow-400',
                bg: 'bg-yellow-900/30',
                border: 'border-yellow-400/20',
                hoverBg: 'hover:bg-yellow-900/40'
            };
        case 'info':
            return {
                text: 'text-blue-400',
                bg: 'bg-blue-900/30',
                border: 'border-blue-400/20',
                hoverBg: 'hover:bg-blue-900/40'
            };
        case 'debug':
            return {
                text: 'text-purple-400',
                bg: 'bg-purple-900/30',
                border: 'border-purple-400/20',
                hoverBg: 'hover:bg-purple-900/40'
            };
        case 'trace':
            return {
                text: 'text-gray-400',
                bg: 'bg-gray-900/30',
                border: 'border-gray-400/20',
                hoverBg: 'hover:bg-gray-900/40'
            };
        case 'fatal':
            return {
                text: 'text-red-600',
                bg: 'bg-red-900/50',
                border: 'border-red-600/30',
                hoverBg: 'hover:bg-red-900/60'
            };
        default:
            return {
                text: 'text-slate-300',
                bg: 'bg-slate-800/30',
                border: 'border-slate-700',
                hoverBg: 'hover:bg-slate-700/50'
            };
    }
};

export default function SpecialPropertyFilters() {
    const {
        specialProperties,
        specialActiveFilters,
        togglePropertyFilter,
        clearPropertyFilters,
    } = useLogStore();

    const specialPropertyKeys = ['level', 'name', 'tags'];
    const availableSpecialProperties = specialPropertyKeys.filter(prop =>
        specialProperties[prop] && specialProperties[prop].size > 0
    );

    if (availableSpecialProperties.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-300">Quick Filters</h3>

            {availableSpecialProperties.map((property) => {
                const Icon = SPECIAL_PROPERTY_ICONS[property as keyof typeof SPECIAL_PROPERTY_ICONS];
                const values = Array.from(specialProperties[property] || []).sort();
                const activeValues = specialActiveFilters[property] || new Set();

                return (
                    <div key={property} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-medium text-slate-300 capitalize">
                                    {property}
                                </span>
                                <span className="text-xs text-slate-500">
                                    ({values.length})
                                </span>
                            </div>
                            {activeValues.size > 0 && (
                                <button
                                    onClick={() => clearPropertyFilters(property)}
                                    className="text-xs text-slate-400 hover:text-white transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {values.map((value) => {
                                const isActive = activeValues.has(String(value));
                                const isLevel = property === 'level';
                                const levelColors = isLevel ? getLevelColors(String(value)) : null;

                                return (
                                    <button
                                        key={String(value)}
                                        onClick={() => togglePropertyFilter(property, String(value), true)}
                                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md font-medium transition-all ${isActive
                                            ? isLevel
                                                ? `${levelColors?.text} ${levelColors?.bg} border ${levelColors?.border} ring-1 ring-current/30`
                                                : 'bg-indigo-500 text-white ring-1 ring-indigo-400'
                                            : isLevel
                                                ? `${levelColors?.text} ${levelColors?.bg} border ${levelColors?.border} ${levelColors?.hoverBg} hover:text-white`
                                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                                            }`}
                                    >
                                        {isLevel ? String(value).toUpperCase() : String(value)}
                                        {isActive && (
                                            <X
                                                className="w-3 h-3 ml-1 hover:bg-white/20 rounded-full cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    togglePropertyFilter(property, String(value), true);
                                                }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
} 