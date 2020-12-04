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

import { NodeDependencyType } from 'schematics-utilities';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import * as cap_utilities from 'cap-utilities';
import { Schema as ComponentOptions } from './schema';
import { getFileContent } from '@schematics/angular/utility/test';

import { getAppName } from './cap-utils/package';


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
      '<link media="screen" href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i&display=swap|Roboto:300,400,500&display=swap" rel="stylesheet" async defer>', 
      '<link media="screen" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" async defer>',
      '<script src="assets/webcomponentsjs/webcomponents-loader.js"></script>',
      '',
      '<!-- Facebook metas -->',
      '<meta property="fb:app_id" content="0123456789876543210">',
      '<meta property="og:url" content="https://mysite.com">',
      '<meta property="og:title" content="Page to share title">',
      '<meta property="og:description" content="Page to share description">',
      '<meta property="og:image" content="http://mysite.com/assets/image.jpg">',
      '<meta property="og:image:alt" content="Image description">',
      '<meta property="og:image:height" content="">',
      '<meta property="og:image:width" content="">',
      '<meta property="og:type" content="website">',
      '<meta property="og:site_name" content="mysite.com">',
      '',
      '<!-- Twitter metas -->',
      '<meta name="twitter:title" content="Page to share title">',
      '<meta name="twitter:image" content="http://mysite.com/assets/image.jpg">',
      '<meta name="twitter:image:alt" content="Image description">',
      '<meta name="twitter:description" content="Page to share description">',
      '<meta name="twitter:card" content="summary">'
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

    const content = `<!-- <app-header></app-header> -->`;
    cap_utilities.appendToStartFile(host, filePath, content);

    // Add footer to end of file
    const toAdd =
      `<!-- <app-footer></app-footer> -->
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
@import './assets/scss/variables.scss';

/*
*
* ==========================================
* GENERAL
* ==========================================
*
*/

body {
  font-family: 'Open Sans', verdana, sans-serif;
  text-align: center;
  background: $main-bg;
  color: $main-color;
}

a {
  text-decoration: none;
  background-color: transparent;
  -webkit-text-decoration-skip: objects;
}

h1, h2, h3 {
  text-align: center;
  color: $main-color;
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
`;
    cap_utilities.appendToStartFile(host, path, content);
    return host;
  };
}

// function readIntoSourceFile(host: Tree, filePath: string) {
//   const text = host.read(filePath);
//   if (text === null) {
//     throw new SchematicsException(`File ${filePath} does not exist.`);
//   }
//   return ts.createSourceFile(filePath, text.toString('utf-8'), ts.ScriptTarget.Latest, true);
// }

/*function addDeclarationToNgModule(options: ComponentOptions): Rule {
  return (host: Tree) => {
    addToNgModule(host, options, [
      {
        name: 'HeaderComponent',
        path: '/app/header/header.component',
        type: 'component'
      },
      {
        name: 'FooterComponent',
        path: '/app/footer/footer.component',
        type: 'component'
      },
      {
        name: 'HomeModule',
        path: '/app/home/home.module',
        type: 'module'
      },
      {
        name: 'CapResponsiveModule',
        path: '/app/modules/cap-responsive/cap-responsive.module',
        type: 'module'
      }
    ])
    return host;
  };
}*/


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

function addElementsSchematic() {
    return externalSchematic('@angular/elements', 'ng-add', {});
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
        value: 'http://apiurl.com/api/'
      }
    ])
  }
}

export function addPackageJsonDependencies(): Rule {
  return (host: Tree) => cap_utilities.addPackageToPackageJson(host, [
    {
      type: NodeDependencyType.Default,
      pkg: 'cap-angular-schematic-bootstrap',
      version: '^0.0.9'
    },
  ])
  // return (host: Tree) => cap_utilities.addPackageToPackageJson(host, NodeDependencyType.Default, 'cap-angular-schematic-bootstrap', '^0.0.9')
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
    const project: any = getProjectFromWorkspace(workspace, options.project);
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
        // addPackageJsonDependencies(),
        // installPackageJsonDependencies(),
        addDeclarationToNgModule(options),
        addToEnvironments(options),
        mergeWith(templateSource),
        updateIndexFile(files.index),
        updateBodyOfIndexFile(files.index),
        addBootstrapSchematic(),
        addElementsSchematic(),
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
