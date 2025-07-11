import type { PropsWithChildren } from "react";

export type MainProps = {
	ref: React.Ref<HTMLElement>;
};

export const Main: React.FC<PropsWithChildren<MainProps>> = ({
	children,
	ref,
}) => (
	<main ref={ref} id="desktop" className="flex-grow relative overflow-hidden">
		{children}
	</main>
);
