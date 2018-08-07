import { SchematicsException, Tree } from '@angular-devkit/schematics';

const CONFIG_PATH = 'angular.json';

export function readConfig(host: Tree) {
  const sourceText = host.read(CONFIG_PATH)!.toString('utf-8');
  return JSON.parse(sourceText);
}

export function writeConfig(host: Tree, config: JSON) {
  host.overwrite(CONFIG_PATH, JSON.stringify(config, null, 2));
}

function isAngularBrowserProject(projectConfig: any) {
  if (projectConfig.projectType === 'application') {
    const buildConfig = projectConfig.architect.build;
    return buildConfig.builder === '@angular-devkit/build-angular:browser';
  }

  return false;
}

export function getAngularAppName(config: any): string | null {
  const projects = config.projects;
  const projectNames = Object.keys(projects);

  for (const projectName of projectNames) {
    const projectConfig = projects[projectName];
    if (isAngularBrowserProject(projectConfig)) {
      return projectName;
    }
  }

  return null;
}

export function getAngularAppConfig(config: any): any | null {
  const projects = config.projects;
  const projectNames = Object.keys(projects);

  for (const projectName of projectNames) {
    const projectConfig = projects[projectName];
    if (isAngularBrowserProject(projectConfig)) {
      return projectConfig;
    }
  }

  return null;
}

export function addStyle(host: Tree, stylePath: string) {
  const config = readConfig(host);
  const appConfig = getAngularAppConfig(config);

  if (appConfig) {
    appConfig.architect.build.options.styles.push({
      input: stylePath
    });

    writeConfig(host, config);
  } else {
    throw new SchematicsException(`Cannot find valid app`);
  }
}
