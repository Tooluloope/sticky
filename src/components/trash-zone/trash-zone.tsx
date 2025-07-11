export type TrashZoneProps = {
	isActive?: boolean;
	ref: React.Ref<HTMLDivElement>;
};
export const TrashZone = ({ isActive, ref }: TrashZoneProps) => (
	<div
		ref={ref}
		className={
			`absolute bottom-0 left-0 right-0 h-24 flex items-center justify-center border-t-2 border-dashed border-red-500 transition-colors ` +
			(isActive
				? "bg-red-500/20 opacity-100 pointer-events-auto"
				: "bg-red-500/10 opacity-0 pointer-events-none")
		}
	>
		<div className="flex flex-col items-center">
			<span className="material-symbols-outlined text-4xl text-red-500">
				delete
			</span>
			<p className="text-red-500 mt-1">Drop note here to delete</p>
		</div>
	</div>
);
