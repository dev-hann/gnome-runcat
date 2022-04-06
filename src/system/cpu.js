const { Gio } = imports.gi;

const ByteArray = imports.byteArray;
const Config = imports.misc.config;

const [major] = Config.PACKAGE_VERSION.split('.');
const shellVersion = Number.parseInt(major, 10);

const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();
const { System } = Extension.imports.system.system;

// eslint-disable-next-line
var Cpu = class Cpu extends System{
    constructor() {
        super();
        this.file = Gio.File.new_for_path('/proc/stat');
        this.refresh();
    }

    refresh() {
        try {
            const [success, contents] = this.file.load_contents(null);
            if (!success) {
                throw new Error('Can\'t load contents of stat file');
            }

            const procTextData = shellVersion >= 41
                ? new TextDecoder('utf-8').decode(contents)
                : ByteArray.toString(contents);

            const cpuInfo = procTextData
                .split('\n')
                .shift()
                .trim()
                .split(/[\s]+/)
                .map(n => parseInt(n, 10));

            const [
                , // eslint-disable-line
                user,
                nice,
                sys,
                idle,
                iowait,
                irq, // eslint-disable-line
                softirq,
                steal,
                guest, // eslint-disable-line
            ] = cpuInfo;

            const active = user + sys + nice + softirq + steal;
            const total = user + sys + nice + softirq + steal + idle + iowait;

            const utilization = 100 * ((active - this.lastActive) / (total - this.lastTotal));

            this.lastActive = active;
            this.lastTotal = total;
            if (Number.isNaN(utilization)) {
                const utilizationData = JSON.stringify({
                    active,
                    lastActive: this.lastActive,
                    total,
                    lastTotal: this.lastTotal,
                });
                throw new RangeError(`CPU utilization is NaN: ${utilizationData}`);
            }

            this.usage = utilization;
        } catch (e) {
            logError(e, 'RuncatExtensionError'); // eslint-disable-line no-undef
        }

        return this.usage;
    }
};