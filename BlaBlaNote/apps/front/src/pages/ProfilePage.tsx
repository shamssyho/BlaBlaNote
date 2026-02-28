import { FormEvent, useEffect, useState } from 'react';
import { profileApi } from '../api/profileApi';
import { FormMessage } from '../components/profile/FormMessage';
import { Loader } from '../components/ui/Loader';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from '../router/router';
import { ApiError } from '../types/api.types';
import { ProfileUser } from '../types/profile.types';

export function ProfilePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    profileApi
      .getMe()
      .then((user) => {
        setProfile(user);
        setFirstName(user.firstName);
        setLastName(user.lastName);
      })
      .catch((error: ApiError) => {
        setErrorMessage(error.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function onSaveProfile(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSaving(true);

    try {
      const user = await profileApi.updateMe({ firstName, lastName });
      setProfile(user);
      setSuccessMessage('Profile updated successfully.');
    } catch (error) {
      setErrorMessage((error as ApiError).message);
    } finally {
      setIsSaving(false);
    }
  }

  async function onAvatarUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem('avatar') as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      setErrorMessage('Please select an avatar image.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsUploadingAvatar(true);

    try {
      const user = await profileApi.uploadAvatar(file);
      setProfile(user);
      setSuccessMessage('Avatar uploaded successfully.');
      input.value = '';
    } catch (error) {
      setErrorMessage((error as ApiError).message);
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function onChangePassword(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsChangingPassword(true);

    try {
      await profileApi.changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setSuccessMessage('Password changed successfully.');
    } catch (error) {
      setErrorMessage((error as ApiError).message);
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function onDeleteAccount() {
    if (!window.confirm('Are you sure you want to permanently delete your account?')) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await profileApi.deleteMe();
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      setErrorMessage((error as ApiError).message);
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return <Loader label="Loading profile..." />;
  }

  if (!profile) {
    return <p className="text-red-600">Failed to load profile.</p>;
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
      <FormMessage type="success" message={successMessage} />
      <FormMessage type="error" message={errorMessage} />

      <article className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Account information</h2>
        <p className="text-sm text-slate-600">{profile.email}</p>
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt="Avatar"
            className="h-20 w-20 rounded-full border border-slate-200 object-cover"
          />
        ) : null}
        <form className="grid gap-3" onSubmit={onSaveProfile}>
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="First name"
            required
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Last name"
            required
          />
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-white"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save profile'}
          </button>
        </form>

        <form className="grid gap-3" onSubmit={onAvatarUpload}>
          <input name="avatar" type="file" accept="image/*" className="block w-full text-sm" />
          <button
            type="submit"
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
            disabled={isUploadingAvatar}
          >
            {isUploadingAvatar ? 'Uploading...' : 'Upload avatar'}
          </button>
        </form>
      </article>

      <article className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Change password</h2>
        <form className="grid gap-3" onSubmit={onChangePassword}>
          <input
            type="password"
            className="rounded-lg border border-slate-300 px-3 py-2"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="Current password"
            required
          />
          <input
            type="password"
            className="rounded-lg border border-slate-300 px-3 py-2"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="New password"
            minLength={8}
            required
          />
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-white"
            disabled={isChangingPassword}
          >
            {isChangingPassword ? 'Updating...' : 'Change password'}
          </button>
        </form>
      </article>

      <article className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-700">Delete account</h2>
        <p className="text-sm text-red-600">This action is permanent and cannot be undone.</p>
        <button
          className="rounded-lg border border-red-300 bg-white px-4 py-2 text-red-700"
          onClick={onDeleteAccount}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete account'}
        </button>
      </article>
    </section>
  );
}
