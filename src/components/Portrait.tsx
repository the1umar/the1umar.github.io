import { PROFILE } from '../data'

/** The photograph, matted and framed. Nothing clever. */
export function Portrait() {
  return (
    <figure className="portrait-frame">
      <div className="portrait">
        <img
          src={PROFILE.photo}
          alt={`${PROFILE.name}, software engineer`}
          width={1081}
          height={1400}
        />
      </div>
      <figcaption className="portrait-caption">
        <span className="label">Korede Afolami</span>
        <span className="label">Lubbock, TX</span>
      </figcaption>
    </figure>
  )
}
