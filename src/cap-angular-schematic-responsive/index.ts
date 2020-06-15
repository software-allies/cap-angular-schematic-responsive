import { strings } from '@angular-devkit/core';
import {
  move,
  url,
  Tree,
  Rule,
  noop,
  chain,
  apply,
  forEach,
  template,
  FileEntry,
  mergeWith,
  branchAndMerge,
  externalSchematic,
  SchematicsException,
  SchematicContext
} from '@angular-devkit/schematics';
import { FileSystemSchematicContext } from '@angular-devkit/schematics/tools';
import { getWorkspace } from '@schematics/angular/utility/config';
import {
  findModule,
  MODULE_EXT,
  ROUTING_MODULE_EXT
} from '@schematics/angular/utility/find-module';
import { parseName } from '@schematics/angular/utility/parse-name';
import { buildDefaultPath } from '@schematics/angular/utility/project';
import { getProjectFromWorkspace } from '@angular/cdk/schematics/utils/get-project';

import { Schema as ComponentOptions } from './schema';
import { getFileContent } from '@schematics/angular/utility/test';
import { getAppName } from './cap-utils/package';
import { NodeDependencyType } from 'schematics-utilities';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

// import * as cap_utilities from 'cap-utilities';
import * as cap_utilities from '../../../cap-utilities/dist/index';

function updateBodyOfIndexFile(filePath: string): Rule {
  return (tree: Tree) => {

    const toAddBegin =
      `
<div class="container-fluid p-0">`;

    const toAddFinal =
      `</div>
`;

    const component = getFileContent(tree, filePath);
    tree.overwrite(filePath, component.replace(`<body>`, `<body id="app">${toAddBegin}`));

    const componentAfter = getFileContent(tree, filePath);
    tree.overwrite(filePath, componentAfter.replace(`</body>`, `${toAddFinal}</body>`));
  }
}

function updateIndexFile(path: string): Rule {
  return (host: Tree) =>
    /** Appends the given element HTML fragment to the `<head>` element of the specified HTML file. */
    cap_utilities.addLinkStyleToHTMLHead(host, [
      '<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=optional" rel="stylesheet" async defer>',
      '<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i&display=optional" rel="stylesheet" async defer>',
      '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" async defer>'
    ], path);
}

function removeContentFromAppComponentHtml(filePath: string): Rule {
  return (host: Tree) => cap_utilities.removeContentFromFile(host, filePath);
}

function appendToAppComponentFile(filePath: string, options: ComponentOptions): Rule {
  return (host: Tree) => {

    if (options.removeAppComponentHtml) {
      const content =
        `<div id="main">
  <router-outlet></router-outlet>
</div>`;
      cap_utilities.appendToStartFile(host, filePath, content);
    }

    const content = `<app-header></app-header>`;
    cap_utilities.appendToStartFile(host, filePath, content);

    // Add footer to end of file
    const toAdd =
      `<app-footer></app-footer>
<app-loading-screen></app-loading-screen>
<app-modal #searchModal id="searchModal">
  <div>
    <h2 class="text-center">Search content...</h2>
  </div>
</app-modal>`;

    const component = getFileContent(host, filePath);
    host.overwrite(filePath, `${component}${toAdd}`);

    return host;
  };
}

function addStyles(): Rule {
  return (host: Tree) => {
    cap_utilities.addStylesToAngularJSON(host,
      [
        './src/assets/webslidemenu/dropdown-effects/fade-down.css',
        './src/assets/webslidemenu/webslidemenu.scss'
      ])
    return host;
  };
}

function appendToStylesFile(path: string): Rule {
  return (host: Tree) => {
    const content = `
@import url(http://fonts.googleapis.com/css?family=Lato:400,900);
@import './assets/scss/variables.scss';


/*
*
* ==========================================
* GENERAL
* ==========================================
*
*/

body {
  font-family: 'Lato', verdana, sans-serif;
  text-align: center;
  background: $main-bg;
  color: $main-color;
}

a {
  text-decoration: none;
  background-color: transparent;
  -webkit-text-decoration-skip: objects;
}

header {
  &.title {
    padding: 60px 0;
    width: 100%;
    background-color: $main-bg;
  }
  h1, h2, h3 {
    text-align: center;
    color: $main-color;
  }
}

section {
  min-height: 100vh;
  overflow: hidden;
  width: 100%;
  background-color: white;
  transition: margin-left 4s ease-in-out 1s;
  padding: 20px 20px;
}

/*
*
* ==========================================
* HOME
* ==========================================
*
*/

.fullscreen-bg {
  height: 100vh;
  overflow: hidden;
  width: 100%;
  margin-top: -104px;
  background-color: $main-color;
  background: url('assets/images/bg-video.jpg') center center / cover no-repeat $main-color;
  .fullscreen-bg-video {
    position: relative;
    right: 0;
    bottom: 0;
    min-width: 100%; 
    min-height: 100%;
    max-width: none;
  }
}

@media (max-width: 767px) {
  .fullscreen-bg {
    background: url('assets/images/bg-video.jpg') center center / cover no-repeat $main-color;
    margin-top: -55px;
  }
}

.cover-home {
  max-width: 100%;
}

.cover {
  background-color: rgba($color: $main-color, $alpha: 0.3);
  background-size: cover;
  color: white;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  padding-top: 100px;
  .cover-caption {
    width: 100%;
  }
}

/*
*
* ==========================================
* FORMS CONTAINER
* ==========================================
*
*/

.box {
  display: flex;
  align-items: center;
  justify-content: center;
}

.box > div {
  height: max-content !important;
  border-radius: 5px !important;
  border: 1px solid #333 !important;
  background-color: $main-color;
  padding: 35px !important;
  width: 500px !important;
  margin: 0 !important;
  color: $light-color !important;
}

.box form {
  text-align: left;
}

.box .list-group-item {
  background-color: transparent !important;
  border: none !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.125) !important;
}


/*
*
* ==========================================
* CIRCLE BUTTONS
* ==========================================
*
*/

.btn-circle {
  width: 45px;
  height: 45px;
  line-height: 45px;
  text-align: center;
  padding: 0;
  border-radius: 50%;
}

.btn-circle i {
  position: relative;
  top: -1px;
}

.btn-circle-sm {
  width: 35px;
  height: 35px;
  line-height: 35px;
  font-size: 0.9rem;
}

.btn-circle-lg {
  width: 55px;
  height: 55px;
  line-height: 55px;
  font-size: 1.1rem;
}

.btn-circle-xl {
  width: 70px;
  height: 70px;
  line-height: 70px;
  font-size: 1.3rem;
}


/*
*
* ==========================================
* BUTTONS OVERRIDE
* ==========================================
*
*/

.btn-primary {
  background-color: $color1 !important;
}

.btn-secondary {
  background-color: $color2 !important;
}

.btn-success {
  background-color: $color3 !important;
}

.btn-info {
  background-color: $color4 !important;
}

.btn-danger {
  background-color: $color5 !important;
}

`;
    cap_utilities.appendToStartFile(host, path, content);
    return host;
  };
}

function addDeclarationToNgModule(options: ComponentOptions): Rule {
  return (host: Tree) => {
    cap_utilities.addToAngularJSONArchitectBudgets(host, {
      type: 'anyComponentStyle',
      maximumWarning: '40kb',
      maximumError: '50kb'
    }
    );

    cap_utilities.addToNgModule(host, options, [
      {
        name: 'HeaderComponent',
        path: `app/header/header.component`,
        type: 'component'
      },
      {
        name: 'FooterComponent',
        path: `app/footer/footer.component`,
        type: 'component'
      },
      {
        name: 'HomeModule',
        path: `app/home/home.module`,
        type: 'module'
      },
      {
        name: 'CapResponsiveModule',
        path: `app/modules/cap-responsive/cap-responsive.module`,
        type: 'module'
      }
    ])
    return host;
  };
}

function addBootstrapSchematic() {
  return externalSchematic('cap-angular-schematic-bootstrap', 'ng-add', { version: "4.0.0", skipWebpackPlugin: true });
}

function addHomeRoute(options: ComponentOptions): Rule {
  return (host: Tree) => {

    const filePath = `${options.path}/app/app-routing.module.ts`;

    // Add routes to routing
    const toAdd =
      `
    { path: '', pathMatch: 'full', component: HomeComponent },
    { path: 'home', pathMatch: 'full', component: HomeComponent },`;

    const component = getFileContent(host, filePath);
    host.overwrite(filePath, component.replace(`const routes: Routes = [`, `const routes: Routes = [${toAdd}`));

    // Add import to routing
    const content =
      `
import { HomeComponent } from './home/home.component';`;
    cap_utilities.appendToStartFile(host, filePath, content);

    return host;
  };
}

function addToEnvironments(options: ComponentOptions): Rule {
  return (host: Tree) => {
    cap_utilities.addEnvironmentVar(host, [
      {
        env: '',
        appPath: options.path || '/src',
        key: 'apiUrl',
        value: 'http://localhost:4000/api/'
      },
      {
        env: 'prod',
        appPath: options.path || '/src',
        key: 'apiUrl',
        value: 'http://mydomain.com/api/'
      }
    ])
  }
}

export function addPackageJsonDependencies(): Rule {
  return (host: Tree) => cap_utilities.addPackageToPackageJson(host, NodeDependencyType.Default, 'cap-angular-schematic-bootstrap', '^0.0.9')
}

export function installPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.log('info', `🔍 Installing packages...`);
    return host;
  };
}

export function schematicResponsive(options: ComponentOptions): Rule {
  return (host: Tree, context: FileSystemSchematicContext) => {


    // Get project
    options.project = (options.project) ? options.project : getAppName(host);
    if (!options.project) {
      throw new SchematicsException('Option "project" is required.');
    }

    const workspace = getWorkspace(host);
    const project = getProjectFromWorkspace(workspace, options.project);
    if (!project) {
      throw new SchematicsException(`Project is not defined in this workspace.`);
    }

    if (options.path === undefined) {
      options.path = buildDefaultPath(project);
    }

    options.module = findModule(host, options.path, 'app' + MODULE_EXT, ROUTING_MODULE_EXT);
    options.name = '';
    const parsedPath = parseName(options.path!, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;


    const projectType: string = project.projectType || project.projects[options.project].projectType;
    if (projectType !== 'application') {
      throw new SchematicsException(`Is required a project type of "application".`);
    }

    // Get the index path
    const index = project.architect.build.options.index || `src/index.html`;

    // Get the styles.scss file 
    let styles = `src/styles.scss`;

    if (host.read(styles) === null) {
      styles = `src/styles.css`;
    }

    // Get the app.component file
    const appComponent = `src/app/app.component.html`;

    const files: any = {
      index: index,
      styles: styles,
      appComponent: appComponent
    }

    // Object that will be used as context for the EJS templates.
    const baseTemplateContext = {
      ...strings,
      ...options,
    };

    const templateSource = apply(url('./files'), [
      template(baseTemplateContext),
      move(null as any, parsedPath.path),
      forEach((fileEntry: FileEntry) => {
        if (host.exists(fileEntry.path)) {
          host.overwrite(fileEntry.path, fileEntry.content);
        }
        return fileEntry;
      })
    ]);

    return chain([
      branchAndMerge(chain([
        addDeclarationToNgModule(options),
        addToEnvironments(options),
        mergeWith(templateSource),
        updateIndexFile(files.index),
        updateBodyOfIndexFile(files.index),
        addBootstrapSchematic(),
        appendToStylesFile(files.styles),
        addStyles(),
        (options.removeAppComponentHtml) ? removeContentFromAppComponentHtml(files.appComponent) : noop(),
        appendToAppComponentFile(files.appComponent, options),
        addHomeRoute(options)
        /*addIdAppToBody(files.index)*/
      ])),
    ])(host, context);
  };
}
