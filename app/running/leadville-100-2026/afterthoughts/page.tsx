import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leadville Afterthoughts",
  description: "Reflections in the weeks after the Leadville Trail 100.",
  openGraph: {
    title: "Leadville Afterthoughts",
    description: "Reflections in the weeks after the Leadville Trail 100.",
    type: "article",
  },
};

// diffMin: actual minus predicted, in minutes. Positive = behind schedule, negative = ahead.
// place: overall position (of 657) at that timing mat, from the official splits.
// Merilee's Corner Out is the timing mat closest to Carter Summit. Merilee's Corner In
// and Kick to Finish aren't in this list since they aren't stops in the plan above.
type Split = {
  mile: string;
  name: string;
  predicted: string;
  actual: string;
  diffMin: number;
  place: number;
};

const splits: Split[] = [
  { mile: "10.6", name: "Carter Summit", predicted: "5:51a", actual: "5:57 AM", diffMin: 6, place: 197 },
  { mile: "20.5", name: "Turquoise Lake Dam — out", predicted: "7:40a", actual: "7:44 AM", diffMin: 4, place: 191 },
  { mile: "26.0", name: "Outward Bound — out", predicted: "8:34a", actual: "8:43 AM", diffMin: 9, place: 172 },
  { mile: "31.8", name: "Half Pipe — out", predicted: "9:42a", actual: "9:52 AM", diffMin: 10, place: 183 },
  { mile: "40.5", name: "Twin Lakes — out", predicted: "11:47a", actual: "11:54 AM", diffMin: 7, place: 176 },
  { mile: "45.6", name: "Hopeless — out", predicted: "1:54p", actual: "1:55 PM", diffMin: 1, place: 166 },
  { mile: "52.3", name: "Winfield", predicted: "4:02p", actual: "3:55 PM", diffMin: -7, place: 146 },
  { mile: "59.1", name: "Hopeless — in", predicted: "6:48p", actual: "6:45 PM", diffMin: -3, place: 150 },
  { mile: "64.2", name: "Twin Lakes — in", predicted: "8:11p", actual: "7:55 PM", diffMin: -16, place: 149 },
  { mile: "72.8", name: "Half Pipe — in", predicted: "10:44p", actual: "10:37 PM", diffMin: -7, place: 129 },
  { mile: "78.7", name: "Outward Bound — in", predicted: "11:54p", actual: "11:55 PM", diffMin: 1, place: 122 },
  { mile: "84.2", name: "Turquoise Lake Dam — in", predicted: "1:07a Sun", actual: "1:15 AM Sun", diffMin: 8, place: 112 },
  { mile: "100", name: "Finish", predicted: "4:59a Sun", actual: "5:35 AM Sun", diffMin: 36, place: 116 },
];

export default function Afterthoughts() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24">
      <article className="w-full max-w-2xl">
        <Link
          href="/running/leadville-100-2026"
          className="text-sm text-fg/50 underline underline-offset-4 hover:text-fg"
        >
          &larr; Leadville Trail 100
        </Link>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-fg">
          Leadville Afterthoughts
        </h1>
        <p className="mt-2 text-sm text-fg/50">2026-09-02 &middot; eleven days post</p>

        <img
          src="/races/leadville-100-27.jpg"
          alt="Crossing the Leadville Trail 100 finish line, 25:35:08 on the clock"
          className="mt-8 w-full"
        />

        <div className="prose mt-8 text-fg/80 prose-a:text-fg prose-a:underline prose-p:mb-6 prose-h2:text-xl prose-h2:font-bold prose-h2:text-fg prose-h2:mt-10 prose-h2:mb-4">
          <p>
            I&apos;m stoked. That&apos;s the main takeaway from this race.
            I&apos;m super super stoked.
          </p>
          <p>
            This race just went really well. It was the best ultra
            I&apos;ve ever run, by a lot &mdash; a stepwise jump above the next
            best one, not just a gradual improvement. Learnings from a lot of different races
            and runs all landed at once here, and almost every one of them hit.
          </p>

          <h2>Predicted split analysis</h2>
        </div>

        <div className="not-prose mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-center text-sm">
            <thead>
              <tr className="border-b border-fg/20 text-fg/50">
                <th className="py-2 px-3 font-bold">Mile</th>
                <th className="py-2 px-3 font-bold">Place (of 657)</th>
                <th className="py-2 px-3 font-bold">Aid Station</th>
                <th className="py-2 px-3 font-bold">Predicted</th>
                <th className="py-2 px-3 font-bold">Actual</th>
                <th className="py-2 px-3 font-bold">Diff</th>
              </tr>
            </thead>
            <tbody>
              {splits.map((s, i) => {
                const prevPlace = i > 0 ? splits[i - 1].place : undefined;
                const placeUp = prevPlace !== undefined && s.place < prevPlace;
                const placeDown = prevPlace !== undefined && s.place > prevPlace;
                return (
                  <tr key={s.mile} className="border-b border-fg/10">
                    <td className="py-2 px-3 tabular-nums text-fg/60">
                      {s.mile}
                    </td>
                    <td
                      className={`py-2 px-3 tabular-nums font-bold ${
                        placeUp
                          ? "text-emerald-700"
                          : placeDown
                            ? "text-red-700"
                            : "text-fg"
                      }`}
                    >
                      {s.place}
                      {placeUp && " ↑"}
                      {placeDown && " ↓"}
                    </td>
                    <td className="py-2 px-3 font-bold text-fg">{s.name}</td>
                    <td className="py-2 px-3 tabular-nums text-fg/70">
                      {s.predicted}
                    </td>
                    <td className="py-2 px-3 tabular-nums font-bold text-fg">
                      {s.actual}
                    </td>
                    <td
                      className={`py-2 px-3 tabular-nums font-bold ${
                        s.diffMin > 0
                          ? "text-red-700"
                          : s.diffMin < 0
                            ? "text-emerald-700"
                            : "text-fg/40"
                      }`}
                    >
                      {s.diffMin > 0 ? "+" : ""}
                      {s.diffMin}m
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="prose mt-6 text-fg/80 prose-a:text-fg prose-a:underline prose-p:mb-6 prose-h2:text-xl prose-h2:font-bold prose-h2:text-fg prose-h2:mt-10 prose-h2:mb-4">
          <p>
            Going in, I built three sets of splits: an A-goal (25 hours,
            everything goes perfect), a B-goal (27 hours, what I actually
            thought was realistic), and a C-goal (the official cutoffs
            &mdash; just finish the thing).
          </p>
          <p>
            I mapped those across the aid stations by working with Claude. I
            fed it a few of my previous races &mdash; last year&apos;s
            Leadville 50, this year&apos;s Canyons 100k, Rock the Ridge
            &mdash; full GPX files and all, and had it learn how I run on
            flats, downhills, and climbs, and how I fade over the course of
            a race, especially on climbs versus flats. Then I pointed it at
            the Leadville course, had it account for the altitude, the
            extra distance, and the fact that I was in better shape, and
            told it to target a 25-hour finish, then
            iterated a bit after it gave some results. What
            came back wasn&apos;t just an average &mdash; it was grounded in
            actual data on how fast I move on different terrain, projected
            out to what a perfect day at Leadville could look like for me
            specifically.
          </p>
          <p>
            The splits above are that perfect-day set, the A-goal. And it turns
            out I had exactly that kind of day, and it did a genuinely
            good job predicting when I&apos;d hit each spot, which is kind
            of awesome and kind of crazy.
          </p>
          <p>
            Looking back, there are two things I&apos;d change with the model
            for next time. First, the climbs. I thought the steep climbs
            were one of my weaker parts of the course.{" "}
            <em>I felt like I was crawling, making no progress at all.</em> But
            that&apos;s actually where I was gaining time relative to the
            model, which feels backwards from how it felt in the moment.
          </p>
          <p>
            Second, the end. I was pushing as hard as I could, but I
            don&apos;t think the model fully accounted for the wear and tear
            that many miles put on me &mdash; or maybe that&apos;s just me
            not being in as good shape as I could&apos;ve been. Either way,
            it had me moving faster than I actually could over the last
            sixteen miles, and really the last twenty-two to twenty-five
            miles from Outward Bound on.
          </p>
          <p>
            Still, crazy how close it was overall. I was super stoked
            looking at this.
          </p>
          <p>
            Looking forward, where could I have improved the most? That
            first 26 miles &mdash; I ran it super conservatively. I split
            the marathon at 4:43, which is nothing for me, effort-wise.
            Sure, there are climbs, two aid stations, some walking built in,
            but 4:43 is still way conservative. I think I was scared of the
            rest of the race, scared of trashing my legs for what was
            coming. That&apos;s fair, but also kind of dumb. I should run
            that harder next time &mdash; have more faith in the training,
            more faith that the vert and the distance are going to be fine,
            and just send it a bit more through the first 40 miles.
          </p>
          <p>
            That said, these were my aggressive splits &mdash; I
            didn&apos;t know yet that I&apos;d be having the day I was
            having, so I was pacing to where I thought I&apos;d land.
            Looking back, I was chilling at mile 26 when I could&apos;ve
            been working a bit harder and banking time, though I don&apos;t
            think it would&apos;ve changed the finish. For next time, on
            both the pacing and the projections: build in a bit more fade
            late, and go out with a bit more trust early.
          </p>

          <h2>Placing</h2>
          <p>
            I generally don&apos;t care what place I finish these races,
            especially this one &mdash; the field is huge, the race is
            long, and I&apos;m mostly just running my own race, not
            worried about anyone else. But it is a decent relative
            indicator of how I&apos;m doing, and this race shows that
            pretty clearly. I went out relatively slow over the first 26
            miles, then steadily moved up all day. Never any massive jumps
            &mdash; it always felt under control, just steady climbing. And
            that&apos;s net, obviously; I was getting passed some too, just
            passing more.
          </p>
          <p>
            The stretch I noticed it most was with Brooks, Twin Lakes
            inbound to the Dam &mdash; twenty miles where it really felt
            like we were just passing people, passing people, passing
            people. Maybe got passed once or twice ourselves, nothing more.
            The numbers back that up: I moved from 149th to 112th over
            those twenty miles, which is exactly what it felt like.
          </p>
          <p>
            From the Dam to the finish I dropped a few places. Some of that
            might be tracking noise &mdash; it says I dropped seven spots
            in the last mile, but I didn&apos;t see anyone out there, and
            no one was within fifteen minutes of me. It still felt like we
            were closing on people the whole way, but I finished 116th, so
            who knows. Either way: the places are the places. I never
            really thought about racing anyone or passing people out
            there, but it&apos;s kind of cool in hindsight to see the
            relative speed &mdash; how well I ran compared to everyone else
            who was out there.
          </p>

          <h2>The math</h2>
          <p>
            My time was 25:35, or 1,535 minutes. If I&apos;d had a perfect day,
            everything strung together exactly as planned, I think I could have
            run 24:59 &mdash; 1,499. So I was thirty-six minutes off a perfect
            day. That&apos;s 2.3%. I ran the race at 97.7% of the best version
            of it, which is pretty dang good, and I&apos;m not too mad about
            that.
          </p>
          <p>
            I don&apos;t think I left much out there. The one real spot was my
            feet. If I&apos;d gotten them taken care of at Twin Lakes outbound,
            I probably wouldn&apos;t have had to stop at Winfield as long as I
            did &mdash; that turned into a sixteen or eighteen minute stop. I
            didn&apos;t need to be there that long: water, refuel, a bite, back
            on the road. Instead I had to sit and deal with my feet. That&apos;s
            the biggest place I actually gave time away, and it&apos;s pretty
            easily addressable next time.
          </p>
          <p>
            The aid stations otherwise I kind of crushed. The three long stops
            &mdash; Twin Lakes out, Winfield, Twin Lakes in &mdash; ran about
            fifteen minutes each. Across the other ten I spent twenty minutes
            total, so around two minutes apiece, which for me is about all you
            can ask for. Winfield I wish I&apos;d spent less time at. Twin Lakes I think I
            actually needed, both times, as a reset and a gear-up for what was
            coming: Hope Pass, and then the night.
          </p>
          <p>
            I had a chance at 25 hours. Didn&apos;t quite get there, and
            that&apos;s okay. I ran super well and I pushed very much as hard
            as I could. I have no regrets about it. Zero.
          </p>

          <h2>The block</h2>
          <p>
            I put in a lot of training for this one &mdash; by far the most
            I&apos;ve ever done, and it obviously paid off. I knew I was in good
            shape going in. I had the legs. The long runs were coming easily.
          </p>
          <p>
            I settled into a steady state of sixty-eight to seventy-five miles a
            week, with somewhere between five and ten thousand feet of climbing.
            For living in New York City, not bad. Obviously not great. I did
            more climbing during the race than I was doing in a week here, and
            more miles in the race than I was doing in a week here.
          </p>
          <p>
            I also planned a lot more for this race. Course recon, drop bags,
            crew bags. Going out a week early was a complete game changer. But
            there are people going out six weeks early, and people who live in
            Colorado, in the mountains, who are just out there way more. If
            I&apos;d run the whole course ahead of time, on top of being at
            altitude longer, I&apos;d have been more prepared.
          </p>
          <p>
            None of that is a regret for this race. I did what I could for this
            race, and it was a step change from my previous blocks and previous
            races &mdash; fitness going in, planning, execution. It&apos;s more
            that it got me excited about what&apos;s next.
          </p>

          <h2>More</h2>
          <p>
            So far I&apos;ve basically been training and running like an amateur
            runner, which is what I am. But semi-pro doesn&apos;t feel
            unachievable, and I think that&apos;s interesting. I have the
            appetite to get there. When I think about what the big gaps are, it
            comes down to one word: <strong>more</strong>.
          </p>
          <p>
            <strong>More miles.</strong> This block is what I relied on and what
            I was proving out: running more miles equals running faster in
            ultras. Such an obvious thing to say, and not always obvious in
            practice. I can take it a step further. A hundred to 120 a week in
            the next eighteen months isn&apos;t achievable. Ninety is. Going
            from seventy to seventy-five with a peak at eighty-eight, to ninety
            to ninety-five with a peak over a hundred, is a big difference in
            fitness at the start line &mdash; and it&apos;s realistic, which is a
            big point.
          </p>
          <p>
            <strong>More vert.</strong> Five to ten thousand feet was the most
            I&apos;ve ever done, and I&apos;ll take it for this block: one
            treadmill session and one trail session in the weeks I got a good
            chunk in. But fifteen to twenty thousand instead makes the climbs
            easier and leaves the legs less beat up, especially on the
            downhills. Ben Dhiman before UTMB was doing 15k METERS a week.
            I&apos;m not gonna win UTMB any time soon, but still. I can do
            more.
          </p>
          <p>
            <strong>More trails.</strong> I just don&apos;t have my trail legs.
            Living in New York it&apos;s so hard. I did maybe seven or eight
            trail runs the entire block, which is nothing for an ultra block
            &mdash; there are people I&apos;m racing who do that in a week. How
            am I supposed to compete with that without getting to that level?
          </p>
          <p>
            <strong>More speed.</strong> I did no speed work for this race. I
            needed miles and I needed vert much more than I needed speed. I
            was fast enough. I ran sub 3 in the marathon, and my ultra times
            were much slower than my marathon time. I just needed miles and
            vert for this block. But I&apos;m looking forward now. If I had
            to guess, somewhere between 65 and 75% of
            the people who beat me at Leadville could also beat me in a 5k. They
            could probably beat me in a marathon too &mdash; distances in a
            completely different scope to what we&apos;re talking about here.
            That&apos;s just me being too slow. You&apos;re not going to outrun
            your speed. You can fail to reach it, which is super common, but you
            almost never beat it. I ran to my speed at Leadville. To make the
            next jump, my speed has to move. If I&apos;m in 2:45 marathon shape (much
            less 2:35...),
            threshold pace drops, everything gets easier, I move better on the
            trail, and I split that opening marathon in 3:45 instead of 4:45.
            There&apos;s an hour right there, and 3:45 would feel pretty
            effortless, in theory.
          </p>
          <p>
            <strong>More weights.</strong> Literally zero sessions for this
            race. I don&apos;t need to be in the gym six days a week &mdash;
            two, even thirty or forty-five minute sessions would
            make a huge difference for these trail races. Going from zero to
            not-zero is the step change.
          </p>

          <h2>Fueling</h2>
          <p>
            I mostly did a good job here, though probably low on calories, which
            cost me a little. I took the first four or five hours super
            conservatively, which was what I needed to do for this race. But
            thinking forward, there&apos;s some opportunity in pushing higher
            carbs through that stretch.
          </p>

          <h2>What&apos;s next</h2>
          <p>
            I&apos;m not sure what&apos;s next. What race, what goal &mdash; I
            don&apos;t know yet. Right now I&apos;m just enjoying this one.
            There&apos;s going to be a next, but it&apos;s not clear what it
            looks like.
          </p>
          <p>
            Watching UTMB this past weekend didn&apos;t help narrow it down,
            either. Ben Dhiman &mdash; an absolute legend &mdash; won it and
            beat the previous fastest winning time in the race&apos;s history
            by nearly forty-five minutes. My takeaway: aim bigger, go a lot
            harder. I didn&apos;t go that hard for this race. Harder than
            I&apos;ve gone before, sure, but there&apos;s a lot more left out
            there.
          </p>
          <p>
            I don&apos;t know exactly what that looks like yet, but I feel
            like I&apos;ve barely tapped into where I could be. This race was
            a stepwise change, a big jump over the previous ones. There are
            definitely more steps out there.
          </p>
          <p>
            Marathons make it easy to set goals &mdash; you&apos;re shooting
            for a time. Hard to hit, but easy to define. Ultras are harder.
            And that also means the goal means less. Sub-25 at Leadville was
            kind of arbitrary; it wasn&apos;t really a goal, and I
            didn&apos;t get it, and I&apos;m not that mad about it. If
            I&apos;d missed a sub-three marathon, I&apos;d have been upset.
            Missing sub-25 at Leadville, if anything I&apos;m the opposite
            &mdash; the race went so well that I don&apos;t even care about
            the time.
          </p>
          <p>
            So how do you build goals that still mean something, that you
            can still strive for? I don&apos;t think I even had a real goal
            for Leadville, because I didn&apos;t know what I was capable of.
            Now I&apos;ve gotten a taste of it.
          </p>
          <p>
            I think what I want is the jump from amateur to whatever&apos;s
            next. In the marathon, there are guys running 2:30, 2:25, 2:20 &mdash;
            borderline semi-pro, maybe a little faster. What does that look
            like in ultras? Isaac finished twelfth at Leadville in just under
            20 hours, 19:48 or so. Is that the equivalent? Pretty legit.
            Not pro &mdash; you&apos;re not competing for wins, Nike
            isn&apos;t calling &mdash; but you&apos;re sniffing it. I
            don&apos;t think I could run 2:20 in a marathon, but could I do
            the equivalent in an ultra? Who knows.
          </p>
          <p>
            I&apos;m not sure that level is unachievable for me. I think I
            could get there. It&apos;s gonna take a lot more years and a lot
            more miles, probably moving to Colorado. But maybe that&apos;s where I need
            to be. Maybe that&apos;s what&apos;s next &mdash; actually going
            for it, treating it like a sport instead of a hobby.
          </p>
          <p>
            <strong>I don&apos;t think top 10 at Leadville is impossible.</strong>
          </p>
        </div>
      </article>
    </main>
  );
}
