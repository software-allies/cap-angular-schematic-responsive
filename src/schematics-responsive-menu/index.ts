import { strings } from '@angular-devkit/core';
import { 
  apply,
  template,
  branchAndMerge,
  chain,
  forEach,
  FileEntry,
  mergeWith,
  move,
  Rule,
  SchematicsException,
  Tree,
  url,
  externalSchematic,
  noop
 } from '@angular-devkit/schematics';
import { FileSystemSchematicContext } from '@angular-devkit/schematics/tools';
import { InsertChange } from '@schematics/angular/utility/change';
import { getWorkspace } from '@schematics/angular/utility/config';
import {
  buildRelativePath, 
  findModule, 
  MODULE_EXT, 
  ROUTING_MODULE_EXT
} from '@schematics/angular/utility/find-module';
import { parseName } from '@schematics/angular/utility/parse-name';
import { buildDefaultPath } from '@schematics/angular/utility/project';
import { getProjectFromWorkspace } from '@angular/cdk/schematics/utils/get-project';
import { appendHtmlElementToHead } from '@angular/cdk/schematics/utils/html-head-element';import { 
  addDeclarationToModule,
  addProviderToModule,
  addImportToModule
 } from './vendored-ast-utils';
import { 
  appendToStartFile,
  removeContentFromFile
} from './cap-utils';
import { Schema as ComponentOptions } from './schema';
import * as ts from 'typescript';
import { addStyle } from './cap-utils/config';
import { getFileContent } from '@schematics/angular/utility/test';
import { addPackageToPackageJson } from './cap-utils/package';


function updateBodyOfIndexFile(filePath: string): Rule {
    return (tree: Tree) => {

      const toAddBegin = 
`
  <div class="container-fluid p-0">
`;      
      
      const toAddFinal = 
`
  </div>
`;
      
      const component = getFileContent(tree, filePath);
      tree.overwrite(filePath, component.replace(`<body>`, `<body>${toAddBegin}`));

      const componentAfter = getFileContent(tree, filePath);
      tree.overwrite(filePath, componentAfter.replace(`</body>`, `${toAddFinal}</body>`));
    }
}

function updateIndexFile(path: string): Rule {
  return (host: Tree) => {
    /** Appends the given element HTML fragment to the `<head>` element of the specified HTML file. */
    [
      '<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=optional" rel="stylesheet" async defer>',
      '<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i&display=optional" rel="stylesheet" async defer>', 
      '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" async defer>',
      '<script src="assets/js/jquery-latest.min.js" async defer></script>',
    ].map((element: string) => {
      appendHtmlElementToHead(host, path, element);
    });

    return host;
  };
}

function removeContentFromAppComponentHtml(filePath: string): Rule {
  return (host: Tree) => {
    removeContentFromFile(host, filePath);
    return host;
  };
}

function appendToAppComponentFile(path: string, options: ComponentOptions): Rule {
  return (host: Tree) => {

    if (options.removeAppComponentHtml) {
      const content = `<router-outlet></router-outlet>`;
      appendToStartFile(host, path, content);
    }

    const content = `<app-header></app-header>`;
    appendToStartFile(host, path, content);

    return host;
  };
}

function addBootstrapCSS(): Rule {
  return (host: Tree) => {
    addStyle(host, './src/assets/webslidemenu/dropdown-effects/fade-down.css');
    addStyle(host, './src/assets/webslidemenu/webslidemenu.css');
    return host;
  };
}

function appendToStylesFile(path: string): Rule {
  return (host: Tree) => {
    const content = `
      body {
        background-color: #333333 !important;
        color: #f2f2f2 !important;
      }

      app-header {
        height: 103px;
        display: block;
        @media (min-width: 1200px) {}
        @media (min-width: 992px) and (max-width: 1199px) {}
        @media (min-width: 576px) and (max-width: 991px) {
          height: 54px;
        }
        @media (max-width: 575px) {
          height: 54px;
        }
      }

      router-outlet {
        padding-bottom: 80px;
      }

    `;
    appendToStartFile(host, path, content);
    return host;
  };
}

function readIntoSourceFile(host: Tree, filePath: string) {
  const text = host.read(filePath);
  if (text === null) {
    throw new SchematicsException(`File ${filePath} does not exist.`);
  }
  return ts.createSourceFile(filePath, text.toString('utf-8'), ts.ScriptTarget.Latest, true);
}

function addDeclarationToNgModule(options: ComponentOptions): Rule {
  return (host: Tree) => {
    
    const modulePath = options.module;
    // Import Header Component and declare
    let source = readIntoSourceFile(host, modulePath);
    const componentPath = `${options.path}/app/header/header.component`;
    const relativePath = buildRelativePath(modulePath, componentPath);
    const classifiedName = strings.classify(`HeaderComponent`);
    const declarationChanges: any = addDeclarationToModule(
      source,
      modulePath,
      classifiedName,
      relativePath);

    const declarationRecorder = host.beginUpdate(modulePath);
    for (const change of declarationChanges) {
      if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(declarationRecorder);

    // Import and include on Imports the HttpClientModule
    if (options) {
        // Need to refresh the AST because we overwrote the file in the host.
        source = readIntoSourceFile(host, modulePath);
        const servicePath = `@angular/common/http`;
        const relativePath = servicePath;
        const classifiedName = strings.classify(`HttpClientModule`);
        const providerRecorder = host.beginUpdate(modulePath);
        const providerChanges: any = addImportToModule(
            source,
            modulePath,
            classifiedName,
            relativePath);

        for (const change of providerChanges) {
            if (change instanceof InsertChange) {
                providerRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(providerRecorder);
    }
    
    // Import and include on Imports the HomeModule
    if (options) {
        // Need to refresh the AST because we overwrote the file in the host.
        source = readIntoSourceFile(host, modulePath);
        const componentPath = `${options.path}/app/home/home.module`;
        const relativePath = buildRelativePath(modulePath, componentPath);
        const classifiedName = strings.classify(`HomeModule`);
        const providerRecorder = host.beginUpdate(modulePath);
        const providerChanges: any = addImportToModule(
            source,
            modulePath,
            classifiedName,
            relativePath);

        for (const change of providerChanges) {
            if (change instanceof InsertChange) {
                providerRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(providerRecorder);
    }

    // Import and include on Providers the load script ScriptService
    if (options) {
        // Need to refresh the AST because we overwrote the file in the host.
        source = readIntoSourceFile(host, modulePath);
        const servicePath = `${options.path}/app/shared/services/load-scripts.service`;
        const relativePath = buildRelativePath(modulePath, servicePath);
        const classifiedName = strings.classify(`ScriptService`);
        const providerRecorder = host.beginUpdate(modulePath);
        const providerChanges: any = addProviderToModule(
            source,
            modulePath,
            classifiedName,
            relativePath);

        for (const change of providerChanges) {
            if (change instanceof InsertChange) {
                providerRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(providerRecorder);
    }
    return host;
  };
}

function addBootstrapSchematic() {
    return externalSchematic('cap-angular-schematic-bootstrap', 'ng-add', { version: "4.0.0", skipWebpackPlugin: true });
}

function addHomeRoute(): Rule {
  return (host: Tree) => {

    const filePath = "src/app/app-routing.module.ts";
    
    // Add routes to routing
    const toAdd = 
`
    { path: '', pathMatch: 'full', component: HomeComponent },
    { path: 'home', pathMatch: 'full', component: HomeComponent },
    { path: '**', redirectTo: '' }
`;
      
    const component = getFileContent(host, filePath);
    host.overwrite(filePath, component.replace(`const routes: Routes = [];`, `const routes: Routes = [${toAdd}];`));

    // Add import to routing
    const content = 
`
content { HomeComponent } from './home/home.component';
`;
    appendToStartFile(host, filePath, content);

    return host;
  };
}

export function schematicsResponsiveMenu(options: ComponentOptions): Rule {
  return (host: Tree, context: FileSystemSchematicContext) => {

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

    // Get Index
    if (!options.project) {
      throw new SchematicsException('Option "project" is required.');
    }

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

    function addBootstrapToPackageJson(): Rule {
      return (host: Tree) => {
        addPackageToPackageJson(host, 'dependencies', 'cap-angular-schematic-bootstrap', `^0.0.6`);
        return host;
      };
    }

    return chain([
      branchAndMerge(chain([
        addBootstrapToPackageJson(),
        addDeclarationToNgModule(options),
        mergeWith(templateSource),
        updateIndexFile(files.index),
        updateBodyOfIndexFile(files.index),
        addBootstrapSchematic(),
        appendToStylesFile(files.styles),
        addBootstrapCSS(),
        (options.removeAppComponentHtml) ? removeContentFromAppComponentHtml(files.appComponent) :  noop(),
        appendToAppComponentFile(files.appComponent, options),
        addHomeRoute()
      ])),
    ])(host, context);
  };
}
