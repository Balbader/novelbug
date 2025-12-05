'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import posthog from 'posthog-js';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const deleteAccountSchema = z.object({
	reason: z.enum(
		[
			'not-useful',
			'too-expensive',
			'privacy-concerns',
			'found-alternative',
			'too-complicated',
			'other',
		],
		{
			message: 'Please select a reason for deleting your account',
		},
	),
	feedback: z
		.string()
		.max(1000, 'Feedback must be less than 1000 characters')
		.optional(),
	confirmDelete: z.boolean().refine((val) => val === true, {
		message: 'You must confirm that you want to delete your account',
	}),
});

type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;

const deletionReasons = [
	{
		value: 'not-useful',
		label: "The service isn't useful to me",
		description: "I don't find the features helpful",
	},
	{
		value: 'too-expensive',
		label: 'Too expensive',
		description: 'The pricing is not suitable for me',
	},
	{
		value: 'privacy-concerns',
		label: 'Privacy concerns',
		description: 'I have concerns about my data privacy',
	},
	{
		value: 'found-alternative',
		label: 'Found an alternative',
		description: 'I found a better service elsewhere',
	},
	{
		value: 'too-complicated',
		label: 'Too complicated',
		description: 'The service is difficult to use',
	},
	{
		value: 'other',
		label: 'Other',
		description: 'I have a different reason',
	},
];

interface DeleteAccountFormProps {
	username: string;
	onDelete: (data: DeleteAccountFormValues) => Promise<void>;
	onCancel: () => void;
	isDeleting: boolean;
}

export default function DeleteAccountForm({
	username,
	onDelete,
	onCancel,
	isDeleting,
}: DeleteAccountFormProps) {
	const form = useForm<DeleteAccountFormValues>({
		resolver: zodResolver(deleteAccountSchema),
		defaultValues: {
			reason: undefined,
			feedback: '',
			confirmDelete: false,
		},
	});

	const selectedReason = form.watch('reason');

	const onSubmit = async (data: DeleteAccountFormValues) => {
		try {
			// Track account deletion initiated
			posthog.capture('account_deletion_initiated', {
				reason: data.reason,
				has_feedback: !!data.feedback,
			});

			await onDelete(data);
		} catch (error) {
			posthog.captureException(error);
			console.error('Error submitting deletion form:', error);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="space-y-4">
					<div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50">
						<AlertTriangle className="size-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
						<div className="space-y-1">
							<p className="text-sm font-medium text-red-900 dark:text-red-100">
								This action cannot be undone
							</p>
							<p className="text-xs text-red-700 dark:text-red-300">
								All your data, including stories, will be
								permanently deleted. This includes your profile,
								stories, and all associated content.
							</p>
						</div>
					</div>

					<FormField
						control={form.control}
						name="reason"
						render={({ field }) => (
							<FormItem className="space-y-3">
								<FormLabel className="text-base font-medium">
									Why are you deleting your account?
								</FormLabel>
								<FormDescription className="text-sm">
									Help us improve by sharing your reason. This
									information is optional but appreciated.
								</FormDescription>
								<FormControl>
									<RadioGroup
										onValueChange={field.onChange}
										value={field.value}
										className="space-y-3"
									>
										{deletionReasons.map((reason) => (
											<div
												key={reason.value}
												className="flex items-start space-x-3 space-y-0 rounded-lg border border-slate-200 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
											>
												<RadioGroupItem
													value={reason.value}
													id={reason.value}
													className="mt-1"
												/>
												<div className="flex-1 space-y-1">
													<Label
														htmlFor={reason.value}
														className="text-sm font-medium cursor-pointer"
													>
														{reason.label}
													</Label>
													<p className="text-xs text-slate-500 dark:text-slate-400">
														{reason.description}
													</p>
												</div>
											</div>
										))}
									</RadioGroup>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{selectedReason && (
						<FormField
							control={form.control}
							name="feedback"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Additional feedback (optional)
									</FormLabel>
									<FormDescription>
										Tell us more about your experience or
										suggestions for improvement.
									</FormDescription>
									<FormControl>
										<Textarea
											placeholder="Share any additional thoughts..."
											className="min-h-[100px] resize-none"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}

					<FormField
						control={form.control}
						name="confirmDelete"
						render={({ field }) => (
							<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-red-200 dark:border-red-900/50 p-4 bg-red-50/50 dark:bg-red-950/10">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<div className="space-y-1 leading-none">
									<FormLabel className="text-sm font-medium text-red-900 dark:text-red-100 cursor-pointer">
										I understand that this action cannot be
										undone and I want to permanently delete
										my account
									</FormLabel>
									<FormDescription className="text-xs text-red-700 dark:text-red-300">
										By checking this box, you confirm that
										you want to delete your account and all
										associated data.
									</FormDescription>
								</div>
							</FormItem>
						)}
					/>
				</div>

				<div className="flex justify-end gap-3 pt-4 border-t">
					<Button
						type="button"
						variant="outline"
						onClick={onCancel}
						disabled={isDeleting}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="destructive"
						disabled={isDeleting || !form.formState.isValid}
						className="gap-2"
					>
						{isDeleting ? (
							<>
								<Spinner className="size-4" />
								Deleting Account...
							</>
						) : (
							<>
								<Trash2 className="size-4" />
								Delete Account
							</>
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
