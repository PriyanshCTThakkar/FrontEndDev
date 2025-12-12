import { createRoute, type AnyRoute } from "@tanstack/react-router"

export default (parent: AnyRoute) => createRoute({
  path: '/page1',
  getParentRoute: () => parent,
  component: Component,
})

function Component() {
    return(
        <>
            <h1>Page 1</h1>
        </>
    )
}