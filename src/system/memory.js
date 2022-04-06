const { Gio } = imports.gi;
const ByteArray = imports.byteArray;
const Config = imports.misc.config;

const [major] = Config.PACKAGE_VERSION.split('.');
const shellVersion = Number.parseInt(major, 10);

// eslint-disable-next-line
var Memory = class Memory {
    constructor() {
        this.utilization = 0;

        this.procStatFile = Gio.File.new_for_path('/proc/meminfo');

        this.refresh();
    }

    refresh() {
        try {
            const [success, contents] = this.procStatFile.load_contents(null);
            if (!success) {
                throw new Error('Can\'t load contents of meminfo file');
            }

            const procTextData = shellVersion >= 41
                ? new TextDecoder('utf-8').decode(contents)
                : ByteArray.toString(contents);

            const memInfo = procTextData
                .split('\n')
                .map(n => n.substring(0, n.length - 3)
                    .split(':')[1]);

            const [
                totalMem,
                freeMem,
            ] = memInfo.slice(0, 2)
                .map(n => parseInt(n.trim(), 10));

            const active = totalMem - freeMem;
            const total = totalMem;
            const utilization = 100 * (active / total);

            if (Number.isNaN(utilization)) {
                const utilizationData = JSON.stringify({
                    active,
                    lastActive: this.lastActive,
                    total,
                    lastTotal: this.lastTotal,
                });
                throw new RangeError(`Memory utilization is NaN: ${utilizationData}`);
            }

            this.utilization = utilization;
        } catch (e) {
            logError(e, 'RuncatExtensionError'); // eslint-disable-line no-undef
        }

        return this.utilization;
    }
};