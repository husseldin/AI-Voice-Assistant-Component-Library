import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceCommand, CommandIntent } from '../../../features/voice-commands/types';

interface VoiceCommandPaletteProps {
  commands: VoiceCommand[];
  onCommandSelect: (command: VoiceCommand, params?: Record<string, any>) => void;
  isOpen: boolean;
  onClose: () => void;
  searchQuery?: string;
  className?: string;
}

/**
 * VoiceCommandPalette - Command palette UI for voice commands
 * Similar to VS Code command palette
 */
const VoiceCommandPalette: React.FC<VoiceCommandPaletteProps> = ({
  commands,
  onCommandSelect,
  isOpen,
  onClose,
  searchQuery = '',
  className = '',
}) => {
  const [search, setSearch] = useState(searchQuery);
  const [filteredCommands, setFilteredCommands] = useState<VoiceCommand[]>(commands);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (searchQuery) setSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (!search) {
      setFilteredCommands(commands);
      return;
    }

    const filtered = commands.filter(cmd => {
      const searchLower = search.toLowerCase();
      return (
        cmd.name.toLowerCase().includes(searchLower) ||
        cmd.description?.toLowerCase().includes(searchLower) ||
        cmd.phrases.some(p => p.toLowerCase().includes(searchLower))
      );
    });

    setFilteredCommands(filtered);
    setSelectedIndex(0);
  }, [search, commands]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        onCommandSelect(filteredCommands[selectedIndex]);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    const category = cmd.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(cmd);
    return acc;
  }, {} as Record<string, VoiceCommand[]>);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 ${className}`}
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="p-4 border-b border-white/10">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search commands... (type or speak)"
                  className="w-full bg-transparent text-white placeholder-white/50 text-lg outline-none"
                  autoFocus
                />
              </div>

              {/* Commands List */}
              <div className="max-h-96 overflow-y-auto">
                {Object.entries(groupedCommands).map(([category, cmds]) => (
                  <div key={category}>
                    {/* Category Header */}
                    <div className="px-4 py-2 text-xs font-semibold text-white/60 uppercase tracking-wider bg-white/5">
                      {category}
                    </div>

                    {/* Commands */}
                    {cmds.map((cmd, index) => {
                      const globalIndex = filteredCommands.indexOf(cmd);
                      const isSelected = globalIndex === selectedIndex;

                      return (
                        <motion.div
                          key={cmd.id}
                          onClick={() => {
                            onCommandSelect(cmd);
                            onClose();
                          }}
                          className={`px-4 py-3 cursor-pointer transition-colors ${
                            isSelected ? 'bg-white/20' : 'hover:bg-white/10'
                          }`}
                          whileHover={{ x: 4 }}
                        >
                          <div className="flex items-center gap-3">
                            {cmd.icon && <span className="text-2xl">{cmd.icon}</span>}
                            <div className="flex-1">
                              <div className="text-white font-medium">{cmd.name}</div>
                              {cmd.description && (
                                <div className="text-white/60 text-sm">{cmd.description}</div>
                              )}
                              <div className="text-white/40 text-xs mt-1">
                                {cmd.phrases.slice(0, 2).join(', ')}
                              </div>
                            </div>
                            {isSelected && (
                              <kbd className="px-2 py-1 bg-white/10 rounded text-xs text-white/80">
                                ↵
                              </kbd>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ))}

                {filteredCommands.length === 0 && (
                  <div className="p-8 text-center text-white/50">
                    No commands found for "{search}"
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                <div className="flex gap-4">
                  <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded">↑↓</kbd> Navigate</span>
                  <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded">↵</kbd> Select</span>
                  <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded">Esc</kbd> Close</span>
                </div>
                <div>{filteredCommands.length} commands</div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VoiceCommandPalette;
