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
import { appendHtmlElementToHead } from '@angular/cdk/schematics/utils/html-head-element';
import { 
  addDeclarationToModule,
  addImportToModule
} from './vendored-ast-utils';
import { Schema as ComponentOptions } from './schema';
import * as ts from 'typescript';
import { getFileContent } from '@schematics/angular/utility/test';
import { 
  appendToStartFile,
  removeContentFromFile,
  addEnvironmentVar
  // addToNgModule
  // addIdToElement
} from './cap-utils';
import { addStyle, addScripts } from './cap-utils/config';
import { getAppName } from './cap-utils/package';
// import {
  // addPackageJsonDependency,
  // NodeDependency,
  // NodeDependencyType
// } from 'schematics-utilities';

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
  return (host: Tree) => {
    /** Appends the given element HTML fragment to the `<head>` element of the specified HTML file. */
    [
      '<link media="screen href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i&display=swap|Roboto:300,400,500&display=swap" rel="stylesheet" async defer>', 
      '<link media="screen href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" async defer>',
      '<link media="screen" href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i&display=swap|Roboto:300,400,500&display=swap" rel="stylesheet" async defer>',
      '<link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css">',
      '<link rel="preconnect" href="https://fonts.gstatic.com">',
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.0/font/bootstrap-icons.css">',
      '<link href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap" rel="stylesheet">',
      '<link media="screen" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" async defer>',
      '<script src="assets/webcomponentsjs/webcomponents-loader.js"></script>',
      '<script src="https://unpkg.com/@popperjs/core@2"></script>',
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

function appendToAppComponentFile(filePath: string, options: ComponentOptions): Rule {
  return (host: Tree) => {
    
    if (options.removeAppComponentHtml) {
      const content = 
`<div id="main">
  <router-outlet></router-outlet>
</div>`;
      appendToStartFile(host, filePath, content);
    }

    const content = `<app-header></app-header>`;
    appendToStartFile(host, filePath, content);

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
    addStyle(host, './src/assets/webslidemenu/dropdown-effects/fade-down.css');
    addStyle(host, './src/assets/webslidemenu/webslidemenu.scss');
    return host;
  };
}

function addScript(): Rule{
  return(host: Tree) => {
    addScripts(host, './src/assets/js/collapse.js')
  }
}

function appendToStylesFile(path: string): Rule {
  return (host: Tree) => {
    const content = `@import './assets/scss/main.scss'; `;
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

    // Import and include on Imports the FooterComponent
    if (options) {
        // Need to refresh the AST because we overwrote the file in the host.
      let source = readIntoSourceFile(host, modulePath);
      const componentPath = `${options.path}/app/footer/footer.component`;
      const relativePath = buildRelativePath(modulePath, componentPath);
      const classifiedName = strings.classify(`FooterComponent`);
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

    // Import and include on Imports the SharedComponentsModule
    if (options) {
      // Need to refresh the AST because we overwrote the file in the host.
      source = readIntoSourceFile(host, modulePath);
      const componentPath = `${options.path}/app/modules/cap-responsive/cap-responsive.module`;
      const relativePath = buildRelativePath(modulePath, componentPath);
      const classifiedName = strings.classify(`CapResponsiveModule`);
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

    return host;
  };
}

// function addBootstrapSchematic() {
//     return externalSchematic('cap-angular-schematic-bootstrap', 'ng-add', { version: "4.0.0", skipWebpackPlugin: true });
// }

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
    appendToStartFile(host, filePath, content);

    return host;
  };
}

function addCollapseFunctionality(): Rule {
  return (host: Tree) => {
    
  const filePath = './src/assets/js/collapse.js'
    // Add footer to end of file
    const toAdd = 
`setTimeout(() => {
  const coll = document.getElementsByClassName("collapsible__button");
  for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("active");
      let content = this.nextElementSibling;
      if (content.style.display === "flex") {
        content.style.display = "none";
      } else {
        content.style.display = "flex";
      }
    });
  }
}, 1000);`;
      
    host.overwrite(filePath, `${toAdd}`);

    return host;
  };
}

function addToEnvironments(options: ComponentOptions): Rule {
    return (host: Tree) => {
        addEnvironmentVar(host, '', options.path || '/src', 'apiUrl', 'http://localhost:4000/api/');
        addEnvironmentVar(host, 'prod', options.path || '/src', 'apiUrl', 'http://apiurl.com/api/');
        // addEnvironmentVar(host, '', options.path || '/src', 'sfApiUrl', '');
        // addEnvironmentVar(host, 'prod', options.path || '/src', 'sfApiUrl', '');
    }
}

/*function addIdAppToBody(htmlFilePath: string): Rule {
    return (host: Tree) => {
      addIdToElement(host, htmlFilePath, 'app', 'body');
    }
}*/

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
        addDeclarationToNgModule(options),
        addToEnvironments(options),
        mergeWith(templateSource),
        updateIndexFile(files.index),
        updateBodyOfIndexFile(files.index),
        addCollapseFunctionality(),
        // addBootstrapSchematic(),
        addElementsSchematic(),
        appendToStylesFile(files.styles),
        addStyles(),
        addScript(),
        (options.removeAppComponentHtml) ? removeContentFromAppComponentHtml(files.appComponent) :  noop(),
        appendToAppComponentFile(files.appComponent, options),
        addHomeRoute(options)
        /*addIdAppToBody(files.index)*/
      ])),
    ])(host, context);
  };
}
