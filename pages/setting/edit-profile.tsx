import React, { useState, Fragment, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiAtSign } from 'react-icons/fi';
import SettingLayout from '../../layouts/setting-layout';
import { Button, Input } from '../../components';
import { AiOutlineCalendar, AiOutlineHome, AiOutlineLoading3Quarters, AiOutlineUser } from 'react-icons/ai';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BsCheck, BsGenderAmbiguous } from 'react-icons/bs';
import { Listbox, Transition } from '@headlessui/react';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { TiWarning } from 'react-icons/ti';
import { selectUser } from '../../redux/reducers/user-slice';
import { useAppDispatch, useAppSelector } from '../../hook/redux';
import educationApi from '../../api/education-api';
import { toastError, toastSuccess } from '../../util/toast';
import { userEdit } from '../../redux/actions/user-action';
import { handleFullName } from '../../util/handle-name';

interface IFormData {
    name: string;
    birthday: Date;
    gender: 'male' | 'female' | 'other';
    email: string;
    address: string;
    phone: string;
    education: string;
}

export default function EditProfile() {
    const dispatch = useAppDispatch();
    const API = process.env.API_ADMINISTRATIVE_UNIT_URL;

    const [birthday, setBirthday] = useState<Date>(new Date());
    const [educations, setEducations] = useState<IEducation[]>([]);
    const [selectedEducation, setSelectedEducation] = useState<IEducation>();
    const [provinces, setProvinces] = useState<IProvince[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<IProvince>();
    const [submited, setSubmited] = useState(false);
    const user = useAppSelector(selectUser).data;
    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
    } = useForm<IFormData>();

    useEffect(() => {
        educationApi
            .getEducations()
            .then((data) => {
                setEducations(data);
                setSelectedEducation(data[0]);
            })
            .catch((error) => console.log('error ', error));

        fetch(`${API}/province`)
            .then((data) => data.json())
            .then((data) => {
                setProvinces(data.results);
                setSelectedProvince(data.results[0]);
            })
            .catch((error) => console.log('error ', error));
    }, []);

    useEffect(() => {
        if (user) {
            setValue('name', `${user.name.firstName} ${user.name.lastName}`);
            setValue('address', user.address || '');
            if (provinces.length > 0) {
                const province = provinces.find((item) => item.province_name === user.address);
                setSelectedProvince(province);
            }
            setValue('birthday', new Date(user.birthday));
            setValue('education', user.education || '');
            if (educations.length > 0) {
                const education = educations.find((item) => item._id === user.education);
                setSelectedEducation(education);
            }
            setValue('email', user.email);
            setValue('gender', user.gender);
            setValue('phone', user.phone);
            setBirthday(new Date(user.birthday));
        }
    }, [user, provinces, educations]);

    const onSubmit = async (values: IFormData) => {
        try {
            setSubmited(true);

            await dispatch(
                userEdit({
                    ...values,
                    name: handleFullName(values.name),
                    birthday: values.birthday.toISOString(),
                }),
            ).unwrap();
            toastSuccess('Chỉnh sửa thông tin thành công');

            setSubmited(false);
        } catch (error) {
            toastError(error as string);
        }
    };

    return (
        <SettingLayout>
            <form id="edit-info" className="grid grid-cols-2 gap-3 p-8" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                    <p>Họ và tên</p>
                    <Input
                        type="text"
                        disabled={submited}
                        placeholder="Nguyễn Văn A"
                        register={register}
                        name="name"
                        border
                        options={{
                            required: {
                                value: true,
                                message: 'Vui lòng nhập họ tên.',
                            },
                        }}
                        errors={errors.name?.message}
                    />
                </div>
                <div className="space-y-2">
                    <p>Email</p>
                    <Input
                        type="email"
                        disabled={submited}
                        placeholder="abcd@gmail.com"
                        register={register}
                        name="email"
                        border
                        options={{
                            required: {
                                value: true,
                                message: 'Vui lòng nhập email.',
                            },
                        }}
                        errors={errors.email?.message}
                    />
                </div>
                <div className="space-y-2">
                    <p>Ngày sinh</p>
                    <div className="w-full border  flex items-center bg-white px-[10px] gap-3 rounded-lg focus-within:border-secondary-30">
                        <AiOutlineCalendar size={24} />
                        <DatePicker
                            {...register('birthday', {
                                required: { value: true, message: 'Vui lòng chọn ngày sinh.' },
                            })}
                            disabled={submited}
                            dateFormat="dd/MM/yyyy"
                            className="w-full py-4 focus:outline-none disabled:cursor-not-allowed"
                            selected={birthday}
                            onChange={(date: Date) => {
                                setValue('birthday', date), setBirthday(date);
                            }}
                        />
                    </div>
                    {errors.birthday?.message && (
                        <div className="flex items-center gap-1">
                            <TiWarning size={14} fill="#ef4444" />
                            <p className="text-red-500">{errors.birthday?.message}</p>
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                    <p>Giới tính</p>
                    <div className="w-full border flex items-center justify-between bg-white py-4 px-[10px] gap-3 rounded-lg focus-within:border-secondary-30">
                        <div className="flex items-center space-x-2 ">
                            <input
                                {...register('gender', {
                                    required: { value: true, message: 'Vui lòng chọn giới tính.' },
                                })}
                                disabled={submited}
                                type="radio"
                                name="gender"
                                className="disabled:cursor-not-allowed"
                                value="male"
                            />
                            <label htmlFor="gender">Nam</label>
                        </div>
                        <div className="flex items-center space-x-2 ">
                            <input
                                {...register('gender', {
                                    required: { value: true, message: 'Vui lòng chọn giới tính.' },
                                })}
                                type="radio"
                                disabled={submited}
                                name="gender"
                                className="disabled:cursor-not-allowed"
                                value="female"
                            />
                            <label htmlFor="gender">Nữ</label>
                        </div>
                        <div className="flex items-center space-x-2 ">
                            <input
                                {...register('gender', {
                                    required: { value: true, message: 'Vui lòng chọn giới tính.' },
                                })}
                                type="radio"
                                className="disabled:cursor-not-allowed"
                                name="gender"
                                disabled={submited}
                                value="other"
                            />
                            <label htmlFor="gender">Khác</label>
                        </div>
                    </div>
                    {errors.gender?.message && (
                        <div className="flex items-center gap-1">
                            <TiWarning size={14} fill="#ef4444" />
                            <p className="text-red-500">{errors.gender?.message}</p>
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                    <p>Trình độ học vấn</p>
                    <Listbox
                        {...register('education', {
                            required: { value: true, message: 'Vui lòng chọn trình độ học vấn.' },
                        })}
                        disabled={submited}
                        value={selectedEducation}
                        onChange={(value) => {
                            setValue('education', value._id);
                            setSelectedEducation(value);
                        }}
                    >
                        <div className="relative mt-1">
                            <Listbox.Button className="relative w-full py-4 pl-3 pr-10 text-left bg-white border rounded-lg cursor-default disabled:cursor-not-allowed focus:outline-none">
                                <span className="block truncate">{selectedEducation?.name}</span>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <HiOutlineChevronDown size={20} />
                                </span>
                            </Listbox.Button>
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute z-10 w-full py-1 mt-2 overflow-auto text-base bg-white rounded-md max-h-60 ring-1 ring-black ring-opacity-10 focus:outline-none sm:text-sm">
                                    {educations.map((education) => (
                                        <Listbox.Option
                                            key={education._id}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                    active ? 'bg-gray-100 text-gray-600' : 'text-gray-900'
                                                }`
                                            }
                                            value={education}
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span
                                                        className={`block truncate ${
                                                            selected ? 'font-medium' : 'font-normal'
                                                        }`}
                                                    >
                                                        {education.name}
                                                    </span>
                                                    {selected ? (
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                                                            <BsCheck size={24} />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                    {errors.education?.message && (
                        <div className="flex items-center gap-1">
                            <TiWarning size={14} fill="#ef4444" />
                            <p className="text-red-500">{errors.education?.message}</p>
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                    <p>Số điện thoại</p>
                    <Input
                        type="text"
                        placeholder="address"
                        disabled={submited}
                        register={register}
                        name="phone"
                        border
                        options={{
                            required: {
                                value: true,
                                message: 'Vui lòng nhập số điện thoại.',
                            },
                        }}
                        errors={errors.phone?.message}
                    />
                </div>
                <div className="space-y-2">
                    <p>Nơi ở hiện tại (Tỉnh/ Thành Phố)</p>
                    <Listbox
                        {...register('address', {
                            required: { value: true, message: 'Vui lòng chọn tỉnh/ thành phố.' },
                        })}
                        disabled={submited}
                        value={selectedProvince}
                        onChange={(value) => {
                            setValue('address', value.province_name);
                            setSelectedProvince(value);
                        }}
                    >
                        <div className="relative mt-1">
                            <Listbox.Button className="relative w-full py-4 pl-3 pr-10 text-left bg-white border rounded-lg cursor-default disabled:cursor-not-allowed focus:outline-none">
                                <span className="block truncate">{selectedProvince?.province_name}</span>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <HiOutlineChevronDown size={20} />
                                </span>
                            </Listbox.Button>
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute z-10 w-full py-1 mt-2 overflow-auto text-base bg-white rounded-md max-h-60 ring-1 ring-black ring-opacity-10 focus:outline-none sm:text-sm">
                                    {provinces.map((province) => (
                                        <Listbox.Option
                                            key={province.province_id}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                    active ? 'bg-gray-100 text-gray-600' : 'text-gray-900'
                                                }`
                                            }
                                            value={province}
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span
                                                        className={`block truncate ${
                                                            selected ? 'font-medium' : 'font-normal'
                                                        }`}
                                                    >
                                                        {province.province_name}
                                                    </span>
                                                    {selected ? (
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                                                            <BsCheck size={24} />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                    {errors.address?.message && (
                        <div className="flex items-center gap-1">
                            <TiWarning size={14} fill="#ef4444" />
                            <p className="text-red-500">{errors.address?.message}</p>
                        </div>
                    )}
                </div>
            </form>
            <div className="flex justify-end px-8">
                <button
                    className="btn btn-primary w-fit disabled:cursor-not-allowed"
                    type="submit"
                    form="edit-info"
                    disabled={submited}
                >
                    {submited ? <AiOutlineLoading3Quarters className="animate-spin" size={20} /> : 'Xong'}
                </button>
                {/* <Button title="Submit" typeBtn="submit" color="primary" form="edit-info" className="w-fit" /> */}
            </div>
        </SettingLayout>
    );
}
