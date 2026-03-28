const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');

const appleUI = `      {/* Apple Calendar Integration */}
      <div className="bg-card rounded-xl border border-border shadow-card mb-6 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Calendar size={16} className="text-primary" />
            <span className="text-sm font-semibold">Apple Calendar Sync</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Connect your Apple Calendar to sync events with this group.
          </p>
          {appleCalConnected ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
                <span className="text-xl">🍎</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary">Connected</p>
                  <p className="text-xs text-muted-foreground">Apple Calendar is syncing</p>
                </div>
                <Check size={16} className="text-primary" />
              </div>
              <button
                onClick={handleDisconnectAppleCalendar}
                className="w-full py-2.5 rounded-xl border border-destructive/30 text-destructive text-sm font-semibold hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2"
              >
                <Unlink size={16} />
                Disconnect Apple Calendar
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnectAppleCalendar}
              disabled={appleCalLoading}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <span className="text-xl">🍎</span>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold">Connect Apple Calendar</p>
                <p className="text-xs opacity-80">Sync your iPhone calendar with this group</p>
              </div>
              {appleCalLoading ? <Loader2 size={14} className="animate-spin" /> : <ExternalLink size={14} />}
            </button>
          )}
        </div>
      </div>
      `;

content = content.replace('      {/* Google Calendar Integration (group-specific) */}', appleUI + '      {/* Google Calendar Integration (group-specific) */}');
fs.writeFileSync('src/components/SettingsPage.tsx', content);
console.log('Done!');
