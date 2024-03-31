import React, { Suspense } from 'react'

/**
 * @description 每个路由组件自己处理懒加载
 * @param Component 通过 React.lazy 函数获得的懒加载组件
 */
export function withSuspense(Component: React.LazyExoticComponent<React.FunctionComponent>) {
  const LazyComponent = () => (
    <Suspense fallback={<section className='py-20 text-center text-3xl text-primary'>loading...</section>}>
      <Component />
    </Suspense>
  )

  return LazyComponent
}
