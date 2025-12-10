import { createRoute, type AnyRoute } from "@tanstack/react-router"

export default (parent: AnyRoute) => createRoute({
  path: '/article',
  getParentRoute: () => parent,
  component: Component,
})

function Component() {
    return(
        <>
            <h1>Article 1</h1>
        </>
    )
}