/**
 * @name NotFound
 * @description
 * @author darcrand
 */

import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <>
      <section className='text-center'>
        <h1>NotFound</h1>

        <p>
          <Link to='/'>Back Home</Link>
        </p>
      </section>
    </>
  )
}
