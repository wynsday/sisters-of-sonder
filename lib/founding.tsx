import type { ReactNode } from "react";

/**
 * The Considerations written into the founding document for each Aspiration.
 * They open the Aspiration's Book of Considerations, and appear nowhere else.
 */
export const FOUNDING: Record<string, { title: string; subject: string; consider: ReactNode }> = {
  "less-suffering": {
    title: "The First Aspiration: Considerations of Less Suffering",
    subject: "Less Suffering",
    consider: (
      <>
        The natural world is violent, yet peaceful. It is kind, yet harsh. Violence is a continuum
        and a cycle. When violence is necessary to reduce suffering, it should be sharp,
        definitive, controlled; a precision instrument to prevent unnecessary suffering, such as
        setting a bone. We do not condemn the dragon for killing a sheep in order to sustain
        itself, as we would not condemn the sheep for assaulting greens, nor condemn the greens
        for draining the earth. We do condemn the horrors associated with these actions when done
        with cruel intentions or as byproducts of negligence.
      </>
    ),
  },
  wonder: {
    title: "The Second Aspiration: Considerations of Wonder",
    subject: "Wonder",
    consider: (
      <>
        The number of molecules in a single breath is larger than the number of breaths in the
        atmosphere, which means you have shared a breath with every deity and every ancestor to
        have breathed upon this earth. A mammoth, an enemy, a friend, a person no one remembers,
        and a unicorn, if one ever walked the earth, have all shared a breath with you. We are the
        ancients, for every atom in us is older than the sun. Yet we see the world first with the
        eyes of a child, delight in the prism rainbows dancing on the wall, and find mystery in
        the mundane.
      </>
    ),
  },
  grace: {
    title: "The Third Aspiration: Considerations of Grace",
    subject: "Grace",
    consider: (
      <>
        Grace overflows; it is there for anyone who would have it, to hold or share from
        abundance, as water from a spring can be drawn by whoever comes. Grace contains neither
        forgiveness nor debt, yet for it we can hold gratitude. No one should demand grace or
        gratitude; both are elegant kindnesses extended and held freely, never to be earned or
        repaid. &ldquo;A debt of gratitude&rdquo; is not grace; it is self-imposed or becomes
        unkind leverage.
      </>
    ),
  },
};
