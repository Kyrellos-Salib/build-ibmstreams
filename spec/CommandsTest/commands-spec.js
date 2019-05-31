'use babel';

// import { expect } from "chai";

describe('Register IBM Streams Extension Commands', () => {
  describe('Commands Registration', async () => {
    beforeEach(async () => {
      await atom.packages.activatePackage('build-ibmstreams');
    });

    it('registers commands', () => {
      const expectedCommands = [
        {
          displayName: 'IBM Streams: Build application and submit a job',
          description: 'Build a Streams application and submit job to the Streams instance',
          name: 'spl-build:build-submit'
        },
        {
          displayName: 'IBM Streams: Build application and download application bundle',
          description: 'Build Streams application and download the compiled application bundle',
          name: 'spl-build:build-download'
        },
        {
          displayName: 'IBM Streams: Build application(s) and submit job(s)',
          description: 'Build Streams application(s) and submit job(s) to the Streams instance',
          name: 'spl-build:build-make-submit'
        },
        {
          displayName: 'IBM Streams: Build application(s) and download application bundle(s)',
          description: 'Build Streams application(s) and download the compiled application bundle(s)',
          name: 'spl-build:build-make-download'
        },
        {
          displayName: 'IBM Streams: Submit application bundle to the Streams instance',
          description: 'Submit Streams application to the Streams instance',
          name: 'spl-build:submit'
        },
        {
          displayName: 'IBM Streams: Open Streams Console',
          description: 'Streams Console instance and application management webpage',
          name: 'spl-build:open-streams-console'
        },
        {
          displayName: 'IBM Streams: Open IBM Cloud Dashboard',
          description: 'IBM Cloud dashboard webpage for managing Streaming Analytics services',
          name: 'spl-build:open-public-cloud-dashboard'
        },
        {
          displayName: 'IBM Streams: Open IBM Cloud Private for Data Dashboard',
          description: 'IBM Cloud Private for Data Dashboard webpage for managing the IBM Streams add-on',
          name: 'spl-build:open-icp4d-dashboard'
        },
        {
          displayName: 'IBM Streams: List available toolkits',
          description: 'List available Streams toolkits',
          name: 'spl-build:list-toolkits'
        }
      ];
      const commands = atom.commands
        .findCommands({ target: atom.views.getView(atom.workspace) })
        .filter(command => command.name.startsWith('spl-build'));
      expect(commands.length).toBeGreaterThan(0);
      expect(commands).toEqual(expectedCommands);
    });
  });
});
