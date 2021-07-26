import inside from 'is-path-inside'
import { kebabCase } from 'lodash'
import { extname, join, relative, removeExt, toUnix } from 'upath'

import { ProjectConfig, Route } from '../types/config'

export class FileRouter {
  root: string

  config: ProjectConfig

  useSource: boolean

  constructor(root: string, config: ProjectConfig, useSource = true) {
    this.root = root
    this.config = config
    this.useSource = useSource
  }

  get source() {
    if (this.useSource) {
      return join(this.root, this.config.source)
    }
    return join(this.root, this.config.build.outDir)
  }

  // src/apis/lambda
  getApiDirectory(baseDir: string) {
    return join(this.source, baseDir)
  }

  getRoute(file: string) {
    const { routes } = this.config
    const index = routes.findIndex((route) => {
      const dir = this.getApiDirectory(route.baseDir)
      return this.inside(file, dir)
    })

    return routes[index]
  }

  getGatewayByRoute(route: Route) {
    const gateway = this.config.gateway.find((adapter) => adapter.is(route))

    if (!gateway) {
      throw new Error(
        `Can't find the correct gateway adapter, please check if midway.config.ts is correct`
      )
    }

    return gateway
  }

  isApiFile(file: string) {
    if (file.endsWith('.test.ts') || file.endsWith('.test.js')) {
      return false
    }

    if (extname(file) !== '.ts' && extname(file) !== '.js') {
      return false
    }

    const route = this.getRoute(file)
    return !!route
  }

  protected inside(child: string, parent: string) {
    return inside(toUnix(child), toUnix(parent))
  }

  getFunctionId(file: string, functionName: string, isExportDefault: boolean) {
    const relativePath = relative(this.source, file)
    // src/apis/lambda/index.ts -> apis-lambda-index
    const id = kebabCase(removeExt(relativePath, extname(relativePath)))
    const name = [id, isExportDefault ? '' : `-${functionName}`].join('')
    return name.toLowerCase()
  }
}
